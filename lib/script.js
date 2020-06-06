/**
 * New script file
 */

/* global getAssetRegistry getFactory emit */

/**
 * updateRecord transaction processor function.
 * @param {org.medrex.basic.updateRecord} tx The transaction instance with tx.record healthRecord, tx.nhistory, tx.nmeds, tx.nallergies, tx.nshist, tx.nbt, tx.nbp, tx.nhr, tx.nrr, tx.nextra, tx.nlabs, tx.nassessment, tx.nplan , oldRecord saved for event
 * @transaction 
 */

async function updateRecord(tx) {  // eslint-disable-line no-unused-vars

  // Save the old value of the asset.
  const tempRecord = JSON.stringify(tx.record);

  // Update the asset with the new value.
  tx.record.history = tx.nhistory;
  tx.record.meds = tx.nmeds;
  tx.record.allergies = tx.nallergies;
  tx.record.shist = tx.nshist;
  tx.record.bt = tx.nbt;
  tx.record.bp = tx.nbp;
  tx.record.hr = tx.nhr;
  tx.record.rr = tx.nrr;
  tx.record.extra = tx.nextra;
  tx.record.labs = tx.nlabs;
  tx.record.assessment = tx.nassessment;
  tx.record.plan = tx.nplan;

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
  // Update the asset in the asset registry.
  await assetRegistry.update(tx.record);
  
  //update stats
  // Get the asset registry for the asset.
  const participantRegistry = await getParticipantRegistry('org.medrex.basic.stats');
  var stats = await participantRegistry.get('01'); 
  var num = parseInt(stats.transactions);
  num++;
  stats.transactions =  num.toString();
  // Update the asset in the asset registry.
  await participantRegistry.update(stats);


  // Emit an event for the modified asset.
  let event = getFactory().newEvent('org.medrex.basic', 'updateEvent');
  event.record = tx.record;
  event.oldRecord = tempRecord;
  emit(event);
}


/**
* Give Access to a doctor
* @param {org.medrex.basic.giveAccess} tx The transaction instance with tx.record healthRecord, tx.trusted doctor 
* @transaction
*/

async function giveAccess(tx) {  // eslint-disable-line no-unused-vars

  // Add dId to trustedDocs array
  tx.record.trustedDocs.push("resource:org.medrex.basic.doctor#" + tx.trusted.dId);

  // Remove the dId from requestDocs array
  for( var i = 0; i < tx.record.requestDocs.length; i++)
  { 
    if ( tx.record.requestDocs[i] === ("resource:org.medrex.basic.doctor#" + tx.trusted.dId)) 
    { 
      tx.record.requestDocs.splice(i, 1);
      i--; 
    }
  }
	
  //parameter in requestDocs array for queries to check whether it is populated or not
  if (tx.record.requestDocs.length === 1){
  	if (tx.record.requestDocs[0] === ("populated")){
    	tx.record.requestDocs.splice(0, 1);
    }
  }
  
  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
  // Update the asset in the asset registry.
  await assetRegistry.update(tx.record);
  
   //update stats
  // Get the asset registry for the asset.
  const participantRegistry = await getParticipantRegistry('org.medrex.basic.stats');
  var stats = await participantRegistry.get('01'); 
  var num = parseInt(stats.transactions);
  num++;
  stats.transactions =  num.toString();
  // Update the asset in the asset registry.
  await participantRegistry.update(stats);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent('org.medrex.basic', 'giveAccessEvent');
  event.record = tx.record;
  event.trusted = tx.trusted;
  emit(event);
}

/**
* Revoke Access from a doctor
* @param {org.medrex.basic.revokeAccess} tx The transaction instance with tx.record healthRecord, tx.trusted doctor
* @transaction
*/

async function revokeAccess(tx) {  // eslint-disable-line no-unused-vars

  // Update the asset with the new value.
  for( var i = 0; i < tx.record.trustedDocs.length; i++)
  { 
    if ( tx.record.trustedDocs[i] === ("resource:org.medrex.basic.doctor#" + tx.trusted.dId)) 
    { 
      tx.record.trustedDocs.splice(i, 1);
      i--; 
    }
  }

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
  // Update the asset in the asset registry.
  await assetRegistry.update(tx.record);
  
   //update stats
  // Get the asset registry for the asset.
  const participantRegistry = await getParticipantRegistry('org.medrex.basic.stats');
  var stats = await participantRegistry.get('01'); 
  var num = parseInt(stats.transactions);
  num++;
  stats.transactions =  num.toString();
  // Update the asset in the asset registry.
  await participantRegistry.update(stats);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent('org.medrex.basic', 'revokeAccessEvent');
  event.record = tx.record;
  event.trusted = tx.trusted;
  emit(event);
}

/**
* Request Access from a patient
* @param {org.medrex.basic.requestAccess} tx The transaction instance with tx.record healthRecord, tx.requestingDoc doctor
* @transaction
*/

async function requestAccess(tx) {  // eslint-disable-line no-unused-vars

//check whether the requestDocs array is empty. If yes add a "populated" flag to it
if (tx.record.requestDocs.length === 0){
    tx.record.requestDocs.push("populated");
}
  
// Update the health record with the new request.
tx.record.requestDocs.push("resource:org.medrex.basic.doctor#" + tx.requestingDoc.dId);

// Get the asset registry for the asset.
const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
// Update the asset in the asset registry.
await assetRegistry.update(tx.record);
  
//update stats
// Get the asset registry for the asset.
const participantRegistry = await getParticipantRegistry('org.medrex.basic.stats');
var stats = await participantRegistry.get('01'); 
var num = parseInt(stats.transactions);
num++;
stats.transactions =  num.toString();
// Update the asset in the asset registry.
await participantRegistry.update(stats);

// Emit an event for the modified asset.
let event = getFactory().newEvent('org.medrex.basic', 'requestAccessEvent');
event.record = tx.record;
event.requestingDoc = tx.requestingDoc;
emit(event);
}


/*
* Update Stats
* @param {org.medrex.basic.updateStats} tx The transaction instance with tx.statsToUpdate stats instance, tx.whatToUpdate string either doctor, patient, emr
* @transaction
* 
*/
async function updateStats (tx) {
	//update stats
  	switch (tx.whatToUpdate) {
      case "doctors":
      	var num = parseInt(tx.statsToUpdate.doctors);
        num++;
        tx.statsToUpdate.doctors =  num.toString();
        break;
      case "patients":
        var num = parseInt(tx.statsToUpdate.patients);
        num++;
        tx.statsToUpdate.patients =  num.toString();
        break;
      case "emrs":
        var num = parseInt(tx.statsToUpdate.emrs);
        num++;
        tx.statsToUpdate.emrs =  num.toString();
        break;
      default:
        var num = parseInt(tx.statsToUpdate.transactions);
        num++;
        tx.statsToUpdate.transactions =  num.toString();
        break;        
    }
  	  	
  	// Get the asset registry for the asset.
  	const participantRegistry = await getParticipantRegistry('org.medrex.basic.stats'); 
  	// Update the asset in the asset registry.
  	await participantRegistry.update(tx.statsToUpdate);
}