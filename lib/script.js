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
