export const fetchDesignData = async (designId) => {
    const response = await fetch(`${process.env.PUBLIC_URL}/shapesData.json`);
    const data = await response.json();
    const design = data.designs.find((d) => d.id === designId);
    if (!design) throw new Error(`Design ID ${designId} not found`);
    return design;
  };
  