const loadLeadCommHistory = async (leadId, element) => {    
    const commHistory = await doo.table.getData('leadContact', {
        filter: 'lead.id(eq)' + leadId,
        limit: 20,
        sort: 'createdAt(desc)'
    });
    const lead = await doo.table.getRecord('Leady_1', leadId);

    const leadCreatedAt = new Date(lead.data.created).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });
    const leadModifiedAt = new Date(lead.data.modified).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });
    const salesRepresentative = lead.data.fields.obchodniZastupceJmeno == null ? '' : lead.data.fields.obchodniZastupceJmeno.fields.jmeno + ' ' + lead.data.fields.obchodniZastupceJmeno.fields.prijmeni + ' (' + lead.data.fields.obchodniZastupceJmeno.fields.tym + ')';

    element.innerHTML = `
    <div class="col-sm-6 col-xs-12">                
        <ul class="communication-history">
            
        </ul>
    </div>
    <div class="col-sm-6 col-xs-12">
        <ul class="contact-details">
            <li><i class="far fa-user"></i> <strong>${lead.data.fields.jmeno} ${lead.data.fields.prijmeni}</strong></li>
            <li><i class="far fa-phone"></i> ${lead.data.fields.telefon ?? 'Není vyplněn'}</li>
            <li><i class="far fa-envelope"></i> <a href="mailto:${lead.data.fields.email.href}">${lead.data.fields.email.href ?? 'Není vyplněn'}</a></li>
            <li><i class="far fa-user-plus"></i> Datum založení: ${leadCreatedAt} (${lead.data.fields.vytvoril ?? ''})</li>
            <li><i class="far fa-user-edit"></i> Poslední úprava: ${leadModifiedAt} (${lead.data.fields.autorPosledniZmeny ?? ''})</li>
            <li><i class="far fa-user-tie"></i> Obchodní zástupce: <strong>${salesRepresentative}</strong></li>
        </ul>
    </div>
    `;

    if (commHistory.data.length == 0) { 
        element.firstElementChild.firstElementChild.innerHTML = '<li>Žádná komunikace doposud neproběhla</li>';        
    }

    const parser = new DOMParser();
    commHistory.data.forEach(communication => {
        const createdAtDate = new Date(communication.created).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.created).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        const modifiedAtDate = 'Upraveno: ' + new Date(communication.modified).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.modified).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        const deadlineDate = communication.fields.deadline == null ? '' : ', Deadline: ' + new Date(communication.fields.deadline).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.fields.deadline).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        let communicationTypes = "";

        (Array.isArray(communication.fields.communicationType) ? communication.fields.communicationType : [communication.fields.communicationType]).forEach(type => {
            type = type.toLowerCase();
            if (type == "email") communicationTypes += '<i title="' + type + '" class="far fa-envelope"></i>';
            if (type == "sms") communicationTypes += '<i title="' + type + '" class="far fa-message"></i>';
            if (type == "telefon") communicationTypes += '<i title="' + type + '" class="far fa-phone"></i>';
        });

        const communicationID = communication.id;
        const communicationOutcome = communication.fields.communicationOutcome;
        const communicationFolowUp = (communication.fields.hasOwnProperty('deadlineFollowUp') ? ' - Připomínka na: ' + new Date(communication.fields.deadlineFollowUp).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) : '');
        const communicationNote = (communication.fields.hasOwnProperty('note') ? communication.fields.note : '');
            
        // Parse the element string
        const doc = parser.parseFromString(
            `<li>
                <abbr title="${modifiedAtDate}  ${deadlineDate}" class="modified"><i class="far fa-calendar"></i> ${createdAtDate}</abbr>                
                <span class="outcome">
                    <span class="types">${communicationTypes}</span> ${communicationOutcome ?? "N/A"} ${communicationFolowUp}
                </span>
                ${communicationNote}
            </li>`
        , 'text/html');
        doc.body.firstChild.addEventListener('click', function() {
            doo.form.openForm('leadContact', { 'model': { 'id': communicationID } });
        });

        element.firstElementChild.firstElementChild.appendChild(doc.body.firstChild);
    });
    
    return true;
}

const loadClientCommHistory = async (clientId, element) => {    
    const commHistory = await doo.table.getData('clientcontact', {
        filter: 'client.id(eq)' + clientId,
        limit: 20,
        sort: 'createdAt(desc)'
    });
    
    
    element.innerHTML = `
    <div class="col-sm-6 col-xs-12">                
        <ul class="communication-history">
            
        </ul>
    </div>
    <div class="col-sm-6 col-xs-12">
        <ul class="contact-details">
            
        </ul>
    </div>
    `;

    if (commHistory.data.length == 0) { 
        element.firstElementChild.firstElementChild.innerHTML = '<li>Žádná komunikace doposud neproběhla</li>';        
    }

    const parser = new DOMParser();
    commHistory.data.forEach(communication => {
        const createdAtDate = new Date(communication.created).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.created).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        const modifiedAtDate = 'Upraveno: ' + new Date(communication.modified).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.modified).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        const deadlineDate = communication.fields.deadline == null ? '' : ', Deadline: ' + new Date(communication.fields.deadline).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.fields.deadline).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
        let communicationTypes = "";

        (Array.isArray(communication.fields.communicationType) ? communication.fields.communicationType : [communication.fields.communicationType]).forEach(type => {
            type = type.toLowerCase();
            if (type == "email") communicationTypes += '<i title="' + type + '" class="far fa-envelope"></i>';
            if (type == "sms") communicationTypes += '<i title="' + type + '" class="far fa-message"></i>';
            if (type == "telefon") communicationTypes += '<i title="' + type + '" class="far fa-phone"></i>';
            if (type == "osobně") communicationTypes += '<i title="' + type + '" class="far fa-user-clock"></i>';
        });

        const communicationID = communication.id;
        const communicationOutcome = communication.fields.communicationOutcome;
        const communicationFolowUp = (communication.fields.hasOwnProperty('deadlineFollowUp') ? ' - Připomínka na: ' + new Date(communication.fields.deadlineFollowUp).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) : '');
        const communicationNote = (communication.fields.hasOwnProperty('note') ? communication.fields.note : '');
            
        // Parse the element string
        const doc = parser.parseFromString(
            `<li>
                <abbr title="${modifiedAtDate}  ${deadlineDate}" class="modified"><i class="far fa-calendar"></i> ${createdAtDate}</abbr>                
                <span class="outcome">
                    <span class="types">${communicationTypes}</span> ${communicationOutcome ?? "N/A"} ${communicationFolowUp}
                </span>
                ${communicationNote}
            </li>`
        , 'text/html');
        doc.body.firstChild.addEventListener('click', function() {
            doo.form.openForm('clientcontact', { 'model': { 'id': communicationID } });
        });

        element.firstElementChild.firstElementChild.appendChild(doc.body.firstChild);
    });
    
    return true;
}

return {
    loadLeadCommHistory: loadLeadCommHistory,
    loadClientCommHistory: loadClientCommHistory
};

