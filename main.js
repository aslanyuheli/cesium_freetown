
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
async function addCorridorsGeoJSON() {
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

addCorridorsGeoJSON();

async function loadCategorizedPoints( categoryProperty = "Node") {
  const geojsonUrl = await Cesium.IonResource.fromAssetId(3593352);
  Cesium.GeoJsonDataSource.load(geojsonUrl, {
    clampToGround: true
  }).then(dataSource => {
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);

    const entities = dataSource.entities.values;

    for (let entity of entities) {
      const category = entity.properties[categoryProperty]?.getValue() || "default";

      // Define your category-to-color map
      const colorMap = {
        'bluegreen': Cesium.Color.BLUE,
        'POI': Cesium.Color.PALEVIOLETRED,
        'nightlight': Cesium.Color.DARKMAGENTA ,
        'airtemp': Cesium.Color.RED
      };

      const pointColor = colorMap[category] || colorMap.default;
      entity.billboard = undefined;
      entity.label = undefined;

      // ✅ Add simple point style
      entity.point = new Cesium.PointGraphics({
        pixelSize: 8,
        color: pointColor,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      });

      // Optional: add label
      entity.label = new Cesium.LabelGraphics({
        text: category,
        font: "14px sans-serif",
        fillColor: Cesium.Color.WHITE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -15),
        showBackground: true
      });
    }
  }).otherwise(error => {
    console.error("Error loading GeoJSON:", error);
  });
}

loadCategorizedPoints()
