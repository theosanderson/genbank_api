import axios from 'axios';

const fetchNCBIData = async (query, res) => {
    try {
      const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=${query}&retmode=json`;
      const response = await axios.get(url);
      const data = response.data;
      const accessions = data.esearchresult.idlist;
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nuccore&id=${accessions.join(',')}&retmode=json`;
      const summaryResponse = await axios.get(summaryUrl);
      const summaryData = summaryResponse.data;
      const summaries = summaryData.result;
      const results = [];
      for (const accession in summaries) {
        const summary = summaries[accession];
        results.push({
          accession: accession,
          title: summary.title,
          description: summary.caption,
        });
      }
      return results
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

export default async (req, res) => {
    // return a list of accessions and titles and descriptions
  const { query } = req.query;
  
    const results1 = await fetchNCBIData(query + " AND srcdb_refseq[PROP] ", res);
    const results2 = await fetchNCBIData(query + " NOT srcdb_refseq[PROP] ", res);
    const results = results1.concat(results2);
    res.status(200).send(results);

};
