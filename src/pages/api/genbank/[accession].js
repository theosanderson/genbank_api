import axios from 'axios';

export default async (req, res) => {
  const { accession, rettype } = req.query;

  const type = rettype ? rettype : 'gbwithparts';
  
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accession}&rettype=${type}&retmode=text`;
  
  try {
    const response = await axios.get(url);
    const data = response.data;
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
