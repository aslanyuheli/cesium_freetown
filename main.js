
// Set your Cesium Ion token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjhlZDAwZS1lZjhhLTQ2MzUtYmRiMC1kYjcxODU3YjFiMmEiLCJpZCI6MzE4MDM2LCJpYXQiOjE3NTE2NTY5ODZ9.9W2pmKUT8OfbL-ASC1NIAo-PfgooWxp5qcMYul9i6ds';

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-13.263425698097262, 8.48081832109619, 4000),
});

// Add Cesium OSM Buildings
const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);

// Load GeoJSON as polylines
async function addBuildingGeoJSON() {
  const geoJSONURL = await Cesium.IonResource.fromAssetId(3593060);
  const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
  const dataSource = await viewer.dataSources.add(geoJSON);

  for (const entity of dataSource.entities.values) {
    if (entity.polyline) {
      entity.polyline.width = 4;
      entity.polyline.material = Cesium.Color.fromCssColorString("#42f862");
      entity.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
    }
  }

  viewer.flyTo(dataSource);
}

addBuildingGeoJSON();
