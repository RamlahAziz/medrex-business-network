/**
 * New script file
 */

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.medrex.basic.updateRecord} tx The sample transaction instance.
 * @transaction
 */

async function updateRecord(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldDiag = tx.record.pDiag;

    // Update the asset with the new value.
    tx.record.pDiag = tx.newDiag;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.record);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.medrex.basic', 'updateEvent');
    event.record = tx.record;
    event.oldDiag = oldDiag;
    event.newDiag = tx.newDiag;
    emit(event);
}


/**
 * Sample transaction processor function.
 * @param {org.medrex.basic.giveAccess} tx The transaction instance.
 * @transaction
 */

async function giveAccess(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    //const oldDiag = tx.record.pDiag;

    // Update the asset with the new value.
    tx.record.trustedDocs.push(tx.trusted.dId);

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.record);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.medrex.basic', 'giveAccessEvent');
    event.record = tx.record;
    event.trusted = tx.trusted;
    emit(event);
}

/**
 * Sample transaction processor function.
 * @param {org.medrex.basic.revokeAccess} tx The transaction instance.
 * @transaction
 */

async function revokeAccess(tx) {  // eslint-disable-line no-unused-vars

    // Update the asset with the new value.
  	for( var i = 0; i < tx.record.trustedDocs.length; i++)
    { 
      if ( tx.record.trustedDocs[i] === tx.trusted.dId) 
      { 
        tx.record.trustedDocs.splice(i, 1);
        i--; 
      }
    }

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.medrex.basic.healthRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.record);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.medrex.basic', 'revokeAccessEvent');
    event.record = tx.record;
    event.trusted = tx.trusted;
    emit(event);
}
