const init = async (elementTask, elementHistory) => {

    //Jméno klienta
    if (doo.model.firstname.value || doo.model.surname.value) {
        document.getElementById("ClientName").innerHTML = doo.model.firstname.value + " " + doo.model.surname.value;
        //Email klienta
        document.getElementById("ClientEmail").innerHTML = doo.model.email.value.href;
        //Telefon klienta
        document.getElementById("ClientPhone").innerHTML = doo.model.phone.value;
        //Avatar klienta
        document.getElementById("AvatarClient").innerHTML = getInitials(doo.model.firstname.value, doo.model.surname.value);
    }
    //get initials for avatar
    function getInitials(firstName, lastName) {
        let initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        return initials;
    }


    if (doo.model.salesRepresentative.value) {
        //Jméno obchoďáka
        document.getElementById("SalesName").innerHTML = doo.model.salesRepresentative.value.firstname + " " + doo.model.salesRepresentative.value.surname;
        //Email obchoďáka
        document.getElementById("SalesEmail").innerHTML = doo.model.salesRepresentative.originalValue.workEmail.href;
        //Telefon obchoďáka
        document.getElementById("SalesPhone").innerHTML = doo.model.salesRepresentative.originalValue.workPhone;
        //Avatar obchoďáka
        document.getElementById("AvatarSales").innerHTML = getInitials(doo.model.salesRepresentative.value.firstname, doo.model.salesRepresentative.value.surname);
    } else {
        document.getElementById("SalesName").innerHTML = 'Obchodní zástupce nebyl vybrán.'
    }

    //get initials for avatar
    function getInitials(firstName, lastName) {
        let initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        return initials;
    }

    //client status
    document.getElementById("clientStatusNotes").innerHTML = doo.model.statusDescription.value;
    document.getElementById("clientStatus").innerHTML = doo.model.status.value;
    document.getElementById("clientStatusDateChange").innerHTML = new Date(doo.model.lastActivityDate.value).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' });
    doo.model.status?.value !== undefined && colorizeStatus(doo.model.status.value, 'clientStatus');

    //status colors
    function colorizeStatus(status, className) {
        if (status.includes('Zrušený')) {
            document.getElementById(className).classList.add('tw-text-red-700', 'tw-ring-red-600/20', 'tw-bg-red-50');
        }
        if (status.includes('Odložený')) {
            document.getElementById(className).classList.add('tw-text-yellow-700', 'tw-ring-yellow-600/20', 'tw-bg-yellow-50');
        }
        if (status.includes('Aktivní')) {
            document.getElementById(className).classList.add('tw-text-green-700', 'tw-ring-green-600/20', 'tw-bg-green-50');
        }
    }

    //load tasks for client
    const loadClientTasks = async (clientId, element) => {
        const taskList = await doo.table.getData('task', {
            filter: 'client.id(eq)' + clientId,
            limit: 10
        });

        element.innerHTML = `
    <div class="tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-mb-10">
        <div class="tw-mt-8 tw-flow-root">
            <div class="tw--mx-4 tw--my-2 sm:tw--mx-6 lg:tw--mx-8">
                <div class="tw-inline-block tw-min-w-full tw-py-2 tw-align-middle">
                    <table id="tableTasks" class="tw-min-w-full tw-border-separate border-spacing-0 task-list-client">
                        <thead>
                            <tr>
                            <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-py-3.5 tw-pl-4 tw-pr-3 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter sm:tw-pl-6 lg:tw-pl-8">Status</th>
                            <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter">Popis</th>
                            <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter">Deadline</th>                        
                            </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;

        if (taskList.data.length == 0) {
            element.firstElementChild.firstElementChild.innerHTML = '<span class="tw-text-sm tw-text-gray-500">Žádné ůkoly nebyly zatím zadány.</span>';
        }

        const parser = new DOMParser();
        taskList.data.forEach(task => {
            // Parse the element string
            const deadlineDate = task.fields.deadline == null ? '' : new Date(task.fields.deadline).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(task.fields.deadline).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
            const status = task.fields.status == null ? ' ' : task.fields.status;
            const nameTask = task.fields.taskName == null ? ' ' : task.fields.taskName;
            const taskId = task.id;

            const doc = parser.parseFromString(
                `<table task-history">
                <tbody>
                    <tr>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="clientStatusDateChange">
                        <span class="tw-inline-flex tw-items-center tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset task-status">${status}</span>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                        <span> ${nameTask} </span>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="clientStatusDateChange">
                        ${deadlineDate}
                    </td>
                    </tr>
                </tbody>
                </table>`
                , 'text/html');

            doc.body.firstChild.rows[0].addEventListener('click', function () {
                doo.form.openForm('task', { 'model': { 'id': taskId } });
            });

            let firstRowTable = document.getElementById("tableTasks").getElementsByTagName("tbody")[0];
            firstRowTable.appendChild(doc.body.firstChild.rows[0]);



        });
        const taskStatusSpans = document.getElementsByClassName('task-status');
        for (let i = 0; i < taskStatusSpans.length; i++) {
            if (taskStatusSpans[i].innerHTML.includes('Hotovo')) {
                taskStatusSpans[i].classList.add('tw-text-green-700', 'tw-ring-green-600/20', 'tw-bg-green-50');
            }
            if (taskStatusSpans[i].innerHTML.includes('V řešení')) {
                taskStatusSpans[i].classList.add('tw-text-cyan-700', 'tw-ring-cyan-600/20', 'tw-bg-cyan-50');
            }
            if (taskStatusSpans[i].innerHTML.includes('Zadáno')) {
                taskStatusSpans[i].classList.add('tw-text-orange-700', 'tw-ring-orange-600/20', 'tw-bg-orangeg-50');
            }
        }
        return true;
    }

    loadClientTasks(
        doo.model.id,
        document.getElementById(elementTask)
    );

    //load client history
    const loadClientCommHistoryTailwind = async (clientId, element) => {
        const commHistory = await doo.table.getData('clientCommunication', {
            filter: 'client.id(eq)' + clientId,
            limit: 10,
            sort: 'createdAt(desc)'
        });

        element.innerHTML = `
        <div class="tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-mb-10">
            <div class="tw-mt-8 tw-flow-root">
                <div class="tw--mx-4 tw--my-2 sm:tw--mx-6 lg:tw--mx-8">
                    <div class="tw-inline-block tw-min-w-full tw-py-2 tw-align-middle">
                        <table id="tableHistory" class="tw-min-w-full tw-border-separate border-spacing-0 communication-history">
                            <thead>
                                <tr>
                                <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-py-3.5 tw-pl-4 tw-pr-3 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter sm:tw-pl-6 lg:tw-pl-8">Datum</th>
                                <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter sm:tw-table-cell"></th>
                                <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter">Popis</th>
                                <th scope="col" class="tw-sticky tw-top-0 tw-z-10 tw-border-b tw-border-gray-300 tw-bg-white tw-bg-opacity-75 tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 backdrop-blur backdrop-filter">Poznámka</th>                        
                                </tr>
                            </thead>
                            <tbody>
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;

        if (commHistory.data.length == 0) {
            element.firstElementChild.firstElementChild.innerHTML = '<span class="tw-text-sm tw-text-gray-500">Žádná komunikace doposud neproběhla</span>';
        }

        const parser = new DOMParser();
        commHistory.data.forEach(communication => {
            const createdAtDate = new Date(communication.created).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.created).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
            const modifiedAtDate = 'Upraveno: ' + new Date(communication.modified).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.modified).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
            const deadlineDate = communication.fields.deadline == null ? '' : ', Deadline: ' + new Date(communication.fields.deadline).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) + ' ' + new Date(communication.fields.deadline).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' });
            let communicationTypes = "";

            (Array.isArray(communication.fields.communicationType) ? communication.fields.communicationType : [communication.fields.communicationType]).forEach(type => {
                type = type.toLowerCase();
                if (type == "email") communicationTypes += '<i title="' + type + '" class="far fa-envelope tw-text-yellow-700 tw-ring-yellow-600/20 tw-bg-yellow-50 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset"></i>';
                if (type == "sms") communicationTypes += '<i title="' + type + '" class="far fa-comment tw-text-green-700 tw-ring-green-600/20 tw-bg-green-50 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset"></i>';
                if (type == "telefon") communicationTypes += '<i title="' + type + '" class="far fa-phone tw-text-cyan-700 tw-ring-cyan-600/20 tw-bg-cyan-50 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset"></i>';
            });

            const communicationID = communication.id;
            const communicationOutcome = communication.fields.communicationOutcome;
            const communicationFolowUp = (communication.fields.hasOwnProperty('deadlineFollowUp') ? ' - Připomínka na: ' + new Date(communication.fields.deadlineFollowUp).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) : '');
            const communicationNote = (communication.fields.hasOwnProperty('note') ? communication.fields.note : '');

            // Parse the element string
            const doc = parser.parseFromString(
                `<table communication-history">
                    <tbody>
                        <tr>
                        <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                            <abbr title="${modifiedAtDate}  ${deadlineDate}" class="modified"><i class="far fa-calendar"></i> ${createdAtDate}</abbr>
                        </td>
                        <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="clientStatusNotes">
                            <span class="types">${communicationTypes}</span> 
                        </td>
                        <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="clientStatusDateChange">
                            <span>${communicationOutcome ?? "N/A"} ${communicationFolowUp}</span>
                        </td>
                        <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="clientStatusDateChange">
                            ${communicationNote}
                        </td>
                        </tr>
                    </tbody>
                    </table>`
                , 'text/html');
            doc.body.firstChild.rows[0].addEventListener('click', function () {
                doo.form.openForm('clientContact', { 'model': { 'id': communicationID } });
            });

            let firstRowTable = document.getElementById("tableHistory").getElementsByTagName("tbody")[0];
            firstRowTable.appendChild(doc.body.firstChild.rows[0]);
        });
        return true;
    }

    loadClientCommHistoryTailwind(
        doo.model.id,
        document.getElementById(elementHistory)
    );
}

return {
    init,
};