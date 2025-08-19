async function getMaterials() {
  const res = await fetch(
    "http://localhost:5001/api/materials?forRole=TrgOffr"
  );
  const { data } = await res.json();
  console.log(data);
  const materialSelect = document.getElementById("materialSelect");
  materialSelect.innerHTML = "";
  data.forEach((material) => {
    const materialCard = document.createElement("button");
    materialCard.className = "material-card btn btn--info";
    materialCard.innerHTML =
      material.title +
      " - " +
      new Date(material.createdAt).toLocaleDateString();
    materialCard.onclick = () => {
      window.open(`http://localhost:5001/${material.link}`, "_blank");
    };
    materialSelect.appendChild(materialCard);
  });
}

getMaterials();
