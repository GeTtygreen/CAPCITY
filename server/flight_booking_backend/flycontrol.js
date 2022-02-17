


// export default {
//  autoComplete (req, res) {
  
//   try {
//     const { query } = request;
//     const { data } = await amadeus.referenceData.locations.get({
//       keyword: query.keyword,
//       subType: Amadeus.location.city,
//     });
//     response.json(data);
//   } catch (error) {
//     console.error(error.response);
//     response.json([]);
//   }

// }
// }

  
// export default {
//   flightSearch:(req, res) => {
//     const parameter = req.params.parameter;
//     // Which cities or airports start with ’r'?
//     amadeus.referenceData.locations
//       .get({
//         keyword: parameter,
//         subType: Amadeus.location.any,
//         req.query
//       })
//       .then(function (response) {
//         res.send(response.result);
//       })
//       .catch(function (response) {
//         res.send(response);
//       });
//     console.log(req.params)
//     console.log(req.query)
//   }
  

// }
  
// export {flightSearch}
// export {autoComplete}
