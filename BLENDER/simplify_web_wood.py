"""Create a lighter web GLB; preserve leaf buffers and rebake Blender bark.

Run with Blender/Untitled.blend in background. The .blend and source GLB are
read only. Only trunk/root topology is reduced, to 12% of the current web mesh.
"""
import bpy
import bmesh
import json
import shutil
import struct
from pathlib import Path
import numpy as np
from mathutils.bvhtree import BVHTree

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'web_viewer' / 'web_assets'
SOURCE, TARGET = 'strom_web', 'strom_web_fast'
blob = (OUT / f'{SOURCE}.glb').read_bytes()
jlen = struct.unpack_from('<I', blob, 12)[0]
gltf = json.loads(blob[20:20+jlen])
binary = bytearray(blob[28+jlen:])
report = {'source': SOURCE, 'target': TARGET, 'ratio': 0.12, 'meshes': []}

def accessor(index):
    a = gltf['accessors'][index]
    view = gltf['bufferViews'][a['bufferView']]
    dim = {'VEC2':2, 'VEC3':3, 'VEC4':4, 'SCALAR':1}[a['type']]
    dtype = {5126:'<f4', 5123:'<u2', 5121:'u1', 5125:'<u4'}[a['componentType']]
    return np.ndarray((a['count'], dim), dtype=dtype, buffer=binary,
        offset=view.get('byteOffset', 0)+a.get('byteOffset', 0),
        strides=(view.get('byteStride', np.dtype(dtype).itemsize*dim), np.dtype(dtype).itemsize)).copy()

def append_accessor(values, kind, target):
    values = np.ascontiguousarray(values)
    binary.extend(b'\0' * (-len(binary) % 4))
    offset = len(binary)
    binary.extend(values.tobytes())
    view = len(gltf['bufferViews'])
    gltf['bufferViews'].append({'buffer':0, 'byteOffset':offset,
        'byteLength':values.nbytes, 'target':target})
    a = {'bufferView':view, 'componentType':5126 if values.dtype.kind=='f' else 5125,
         'count':len(values), 'type':kind}
    if kind == 'VEC3' and target == 34962:
        a.update(min=values.min(axis=0).astype(float).tolist(), max=values.max(axis=0).astype(float).tolist())
    index = len(gltf['accessors'])
    gltf['accessors'].append(a)
    return index

def mesh_from_arrays(name, positions, indices, uv=None):
    mesh = bpy.data.meshes.new(name)
    mesh.vertices.add(len(positions))
    mesh.vertices.foreach_set('co', positions.ravel())
    mesh.loops.add(len(indices))
    mesh.loops.foreach_set('vertex_index', indices.astype(np.int32))
    mesh.polygons.add(len(indices)//3)
    mesh.polygons.foreach_set('loop_start', np.arange(0, len(indices), 3, dtype=np.int32))
    mesh.polygons.foreach_set('loop_total', np.full(len(indices)//3, 3, dtype=np.int32))
    mesh.polygons.foreach_set('use_smooth', np.ones(len(indices)//3, dtype=bool))
    if uv is not None:
        layer = mesh.uv_layers.new(name='UVMap')
        layer.data.foreach_set('uv', uv[indices].ravel())
    mesh.update()
    return mesh

reference = bpy.data.materials['Bark_GraphML_Tree']
material = reference.copy()
nodes, links = material.node_tree.nodes, material.node_tree.links
emission = nodes.new('ShaderNodeEmission')
output = next(n for n in nodes if n.type == 'OUTPUT_MATERIAL')
links.new(nodes['Color Ramp.001'].outputs['Color'], emission.inputs['Color'])
links.new(emission.outputs[0], output.inputs['Surface'])
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 1
scene.render.bake.target = 'VERTEX_COLORS'
for ob in scene.objects:
    ob.hide_render = True

def bake_bark(kind, positions, indices):
    converted = np.column_stack((positions[:,0], -positions[:,2], positions[:,1])).astype('<f4')
    mesh = mesh_from_arrays('BarkReference', converted, indices)
    colors = mesh.color_attributes.new(name='BarkPattern', type='FLOAT_COLOR', domain='CORNER')
    mesh.color_attributes.active_color = colors
    ob = bpy.data.objects.new('BarkReference', mesh)
    scene.collection.objects.link(ob)
    mesh.materials.append(material)
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    print('BAKE', kind, len(positions), flush=True)
    bpy.ops.object.bake(type='EMIT')
    rgba = np.empty(len(mesh.loops)*4, dtype=np.float32)
    colors.data.foreach_get('color', rgba)
    per_vertex = np.zeros((len(positions),3), dtype=np.float32)
    per_vertex[indices] = rgba.reshape(-1,4)[:,:3]
    if not np.isfinite(per_vertex).all() or per_vertex.max() < 0.001:
        raise RuntimeError('Invalid bark bake')
    encoded = np.rint(np.clip(per_vertex,0,1)*65535).astype('<u2')
    filename = f'{TARGET}_bark_{kind}.bin'
    encoded.tofile(OUT / filename)
    bpy.data.objects.remove(ob, do_unlink=True)
    bpy.data.meshes.remove(mesh)
    return filename

for gm in gltf['meshes']:
    for prim in gm['primitives']:
        material_name = gltf['materials'][prim['material']]['name']
        if '003' in material_name or '005' in material_name:
            continue
        kind = 'roots' if 'root' in gm['name'].lower() else 'trunk'
        old_positions = accessor(prim['attributes']['POSITION'])
        old_indices = accessor(prim['indices']).ravel()
        uv = accessor(prim['attributes']['TEXCOORD_0'])
        positions_blender = np.column_stack((old_positions[:,0], -old_positions[:,2], old_positions[:,1])).astype('<f4')
        mesh = mesh_from_arrays('Simplified_'+kind, positions_blender, old_indices, uv)
        # Reconnect GLB seam duplicates before collapse; corner UVs remain separate.
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=1e-6)
        bm.to_mesh(mesh)
        bm.free()
        ob = bpy.data.objects.new('Simplified_'+kind, mesh)
        scene.collection.objects.link(ob)
        bpy.ops.object.select_all(action='DESELECT')
        ob.select_set(True)
        bpy.context.view_layer.objects.active = ob
        modifier = ob.modifiers.new('Web wood simplification', 'DECIMATE')
        modifier.ratio = report['ratio']
        modifier.use_collapse_triangulate = True
        print('SIMPLIFY', kind, len(old_indices)//3, flush=True)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        mesh = ob.data
        mesh.polygons.foreach_set('use_smooth', np.ones(len(mesh.polygons), dtype=bool))
        mesh.update()
        mesh.calc_loop_triangles()
        vertex_pos = np.empty((len(mesh.vertices),3), dtype=np.float32)
        vertex_norm = np.empty_like(vertex_pos)
        mesh.vertices.foreach_get('co', vertex_pos.ravel())
        mesh.vertices.foreach_get('normal', vertex_norm.ravel())
        loop_verts = np.empty(len(mesh.loops), dtype=np.int32)
        mesh.loops.foreach_get('vertex_index', loop_verts)
        tri_loops = np.empty(len(mesh.loop_triangles)*3, dtype=np.int32)
        mesh.loop_triangles.foreach_get('loops', tri_loops)
        corner_uv = np.empty((len(mesh.loops),2), dtype=np.float32)
        mesh.uv_layers.active.data.foreach_get('uv', corner_uv.ravel())
        tri_verts = loop_verts[tri_loops]
        # Only split vertices at actual normal/UV seams when forming GLB buffers.
        rows = np.column_stack((vertex_pos[tri_verts], vertex_norm[tri_verts], corner_uv[tri_loops])).astype('<f4')
        unique, inverse = np.unique(rows, axis=0, return_inverse=True)
        new_positions = np.column_stack((unique[:,0], unique[:,2], -unique[:,1])).astype('<f4')
        new_normals = np.column_stack((unique[:,3], unique[:,5], -unique[:,4])).astype('<f4')
        new_uv = unique[:,6:8].copy()
        new_indices = inverse.astype('<u4')
        if not np.isfinite(unique).all() or len(new_indices) >= len(old_indices):
            raise RuntimeError('Geometry simplification failed')
        bvh = BVHTree.FromPolygons(new_positions.tolist(), new_indices.reshape(-1,3).tolist(), all_triangles=True)
        step = max(1, len(old_positions)//6000)
        distances = [bvh.find_nearest(tuple(p))[3] for p in old_positions[::step]]
        item = {'kind':kind, 'oldTriangles':len(old_indices)//3, 'triangles':len(new_indices)//3,
            'oldVertices':len(old_positions), 'vertices':len(new_positions),
            'surfaceErrorP95Meters':float(np.percentile(distances,95)), 'surfaceErrorMaxMeters':float(max(distances)),
            'boundsBefore':[old_positions.min(0).tolist(), old_positions.max(0).tolist()],
            'boundsAfter':[new_positions.min(0).tolist(), new_positions.max(0).tolist()]}
        print('SIMPLIFIED', json.dumps(item), flush=True)
        prim['attributes'] = {
            'POSITION':append_accessor(new_positions, 'VEC3', 34962),
            'NORMAL':append_accessor(new_normals, 'VEC3', 34962),
            'TEXCOORD_0':append_accessor(new_uv, 'VEC2', 34962)}
        prim['indices'] = append_accessor(new_indices.reshape(-1,1), 'SCALAR', 34963)
        item['barkFile'] = bake_bark(kind, new_positions, new_indices)
        report['meshes'].append(item)
        bpy.data.objects.remove(ob, do_unlink=True)
        bpy.data.meshes.remove(mesh)

# Compact referenced accessors/views. Leaf data and embedded images copy byte for
# byte; no importer/exporter is allowed to reorder the 9,932 original leaves.
used_accessors = sorted({index for m in gltf['meshes'] for p in m['primitives']
    for index in [p['indices'], *p['attributes'].values()]})
amap = {old:new for new,old in enumerate(used_accessors)}
gltf['accessors'] = [gltf['accessors'][i] for i in used_accessors]
for m in gltf['meshes']:
    for p in m['primitives']:
        p['indices'] = amap[p['indices']]
        p['attributes'] = {k:amap[v] for k,v in p['attributes'].items()}
used_views = sorted({a['bufferView'] for a in gltf['accessors']} |
    {im['bufferView'] for im in gltf.get('images',[]) if 'bufferView' in im})
vmap = {old:new for new,old in enumerate(used_views)}
packed = bytearray()
views = []
for index in used_views:
    view = gltf['bufferViews'][index].copy()
    data = binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
    packed.extend(b'\0' * (-len(packed)%4))
    view['byteOffset'] = len(packed)
    packed.extend(data)
    views.append(view)
gltf['bufferViews'] = views
for a in gltf['accessors']:
    a['bufferView'] = vmap[a['bufferView']]
for image in gltf.get('images',[]):
    if 'bufferView' in image:
        image['bufferView'] = vmap[image['bufferView']]
gltf['buffers'] = [{'byteLength':len(packed)}]
gltf.setdefault('asset',{}).setdefault('extras',{})['woodSimplification'] = report
json_bytes = json.dumps(gltf, separators=(',',':')).encode('utf-8')
json_bytes += b' ' * (-len(json_bytes)%4)
packed.extend(b'\0' * (-len(packed)%4))
result = struct.pack('<4sII', b'glTF',2,12+8+len(json_bytes)+8+len(packed))
result += struct.pack('<I4s',len(json_bytes),b'JSON')+json_bytes
result += struct.pack('<I4s',len(packed),b'BIN\0')+packed
(OUT/f'{TARGET}.glb').write_bytes(result)
for kind in (0,1):
    shutil.copyfile(OUT/f'{SOURCE}_leaf_{kind}.bin', OUT/f'{TARGET}_leaf_{kind}.bin')
report['bytes'] = len(result)
report['totalTriangles'] = sum(gltf['accessors'][p['indices']]['count']//3 for m in gltf['meshes'] for p in m['primitives'])
(OUT/f'{TARGET}_report.json').write_text(json.dumps(report,indent=2), encoding='utf-8')
metadata_path = OUT/'bark_reference.json'
metadata = json.loads(metadata_path.read_text(encoding='utf-8'))
metadata['meshes'] = [m for m in metadata['meshes'] if m['model'] != TARGET]
metadata['meshes'].extend({'model':TARGET, 'kind':m['kind'], 'vertices':m['vertices'], 'file':m['barkFile']} for m in report['meshes'])
metadata_path.write_text(json.dumps(metadata,indent=2), encoding='utf-8')
print('COMPLETE', json.dumps(report), flush=True)
