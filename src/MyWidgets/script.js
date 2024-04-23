const loadLeadCommHistory = async (leadId, element) => {
    let widgetBody = "";
    const commHistory = await doo.table.getData('leadContact', {
        filter: 'lead.id(eq)' + leadId,
        limit: 20
    });

    widgetBody += "<ul>";

    if (commHistory.data.length == 0) {
        widgetBody += "<li>Žádná komunikace doposud neproběhla</li>"
    }

    commHistory.data.forEach(communication => {
        widgetBody += 
            '<li>' +
            new Date(communication.modified).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) +
            ': ' +
            communication.fields.communicationType.toString().replace(',', ', ') +
            ' - ' +
            communication.fields.communicationOutcome +
            (communication.fields.hasOwnProperty('deadlineFollowUp') ? ', pokračovat: ' + new Date(communication.fields.deadlineFollowUp).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) : '') +
            (communication.fields.hasOwnProperty('note') ? '<br />' + communication.fields.note : '') +
            '</li>';
    });
    widgetBody += "</ul>";
    
    element.innerHTML = widgetBody;

    debugger;
    return true;
}

return {
    loadLeadCommHistory: loadLeadCommHistory
};

