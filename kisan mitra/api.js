// JavaScript Example: Reading Entities
// Filterable fields: image_url, plant_name, scientific_name, health_status, disease_name, symptoms, causes, treatments, growth_tips, confidence_score, language
async function fetchPlantScanEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68b16dd38bf9a620fe27c4b2/entities/PlantScan`, {
        headers: {
            'api_key': '7a855d01607a40f5b3f41b91c1eb76bb', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: image_url, plant_name, scientific_name, health_status, disease_name, symptoms, causes, treatments, growth_tips, confidence_score, language
async function updatePlantScanEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68b16dd38bf9a620fe27c4b2/entities/PlantScan/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '7a855d01607a40f5b3f41b91c1eb76bb', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}

