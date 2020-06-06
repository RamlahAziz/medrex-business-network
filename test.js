/*FOR TESTING ON PLAYGROUND
* Test Query
* @param {org.medrex.basic.testquery} tx The transaction instance with tx.statsToUpdate stats instance,
* tx.whatToUpdate string either doctor, patient, emr
* @transaction
* 
*/

async function testquery(tx){
    const assets = await query('getNonVerifiedRecords', {patientObject:'resource:org.medrex.basic.patient#8018' })
    
    console.log('asset',assets);
    // Emit an event for the modified asset.
        let event = getFactory().newEvent('org.medrex.basic', 'eupdateStats');
        event.olds = JSON.stringify(assets);
        event.news = 'bismillah';
        emit(event);
  
  
      return query('getAccessRequestsForPatient',
                    {patientObject:'resource:org.medrex.basic.patient#resource:org.medrex.basic.patient#6148'}
                   )
      .then(function (results) {
  
         for (var n = 0; n < results.length; n++) {
                 var person = results[n];
                 console.log('emr is ' + (n+1) + ', object is ' +  person);
                 console.log('emr identifier is ' + person.getIdentifier());
  
           return personRegistry.get(person.getIdentifier())
           .then(function (personRecord) {
              console.log('object is ' + personRecord); // all good
             console.log('identifier is ' + person.getIdentifier() );
           }).catch(function (error) {
              // Add optional error handling here.
                console.log(error);
            });
  
  
  
         } // for
  
    }).catch(function (error) {
      // Add optional error handling here.
        console.log(error);
    }); //function
  }
  