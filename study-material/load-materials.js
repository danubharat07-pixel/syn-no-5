const materialsMapping = {
  secCdr: [
    {
      id: "sec-cdr-materials",
      title: "SEC-AUR-PL-FMN-95.doc",
      url: "precis/SEC-AUR-PL-FMN-95.doc",
    },
    {
      id: "sec-cdr-materials",
      title: "Sec-Cdr-Wpn-Precies-amedt-on-31-Mar-18.docx",
      url: "precis/Sec-Cdr-Wpn-Precies-amedt-on-31-Mar-18.docx",
    },
  ],
  advIt: [
    {
      id: "adv-it-materials",
      title: "E-OFFICE.pdf",
      url: "itcs/E-OFFICE.pdf",
    },
    {
      id: "adv-it-materials",
      title: "LMS-KMS-CMS.pdf",
      url: "itcs/LMS-KMS-CMS.pdf",
    },
  ],
  clc: [
    {
      id: "clc-materials",
      title: "Sitting-and-Emp-of-Inf-wpnsScript.doc",
      url: "precis/Sitting-and-Emp-of-Inf-wpnsScript.doc",
    },
    {
      id: "clc-materials",
      title: "Indication-Of-Land-Marks-Script.doc",
      url: "precis/Indication-Of-Land-Marks-Script.doc",
    },
  ],
  itca: [
    {
      id: "itca-materials",
      title: "DBMS.pdf",
      url: "itcs/DBMS.pdf",
    },
    {
      id: "itca-materials",
      title: "QGIS.pdf",
      url: "itcs/QGIS.pdf",
    },
  ],
};

function loadMaterials(elementId, materialKey) {
  const materials = materialsMapping[materialKey];
  const materialsContainer = document.getElementById(elementId);
  if (materialsContainer) {
    materialsContainer.innerHTML = materials
      .map(
        (material) =>
          `<a href="${material.url}" target="_blank">${material.title}</a><br/><br/>`
      )
      .join("");
  }
}

loadMaterials("sec-cdr-materials", "secCdr");
loadMaterials("adv-it-materials", "advIt");
loadMaterials("clc-materials", "clc");
loadMaterials("itca-materials", "itca");
