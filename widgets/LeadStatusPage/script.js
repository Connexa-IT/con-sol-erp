const init = async (elementTask, elementHistory) => {

    //lead
    if (doo.model.firstname.value || doo.model.surname.value) {
        document.getElementById("leadName").innerHTML = doo.model.firstname.value + " " + doo.model.surname.value;
        document.getElementById("leadPhone").innerHTML = doo.model.phone?.value;
        document.getElementById("leadEmail").innerHTML = doo.model.email?.value == null ? 'Email není k dispozici.' : doo.model.email.value.href;
        document.getElementById("avatarLead").innerHTML = getInitials(doo.model.firstname.value, doo.model.surname.value);
    }

    //sales representative
    if (doo.model.salesRepresentative.value) {
        document.getElementById("salesRepresentativeName").innerHTML = doo.model.salesRepresentative.value.firstname + ' ' + doo.model.salesRepresentative.value.surname;
        document.getElementById("salesRepresentativeTeam").innerHTML = doo.model.salesRepresentative.value.team;
        document.getElementById("salesRepresentativePhone").innerHTML = doo.model.salesRepresentative?.value.workPhone ?? 'Telefon není k dispozici';
        document.getElementById("avatarSales").innerHTML = getInitials(doo.model.salesRepresentative.value.firstname, doo.model.salesRepresentative.value.surname);
    } else {
        document.getElementById("salesRepresentativeName").innerHTML = 'Obchodní zástupce nebyl vybrán.'
    }

    //lead status 
    document.getElementById("leadStatusNotes").innerHTML = doo.model.statusDescription.value;
    document.getElementById("leadStatus").innerHTML = doo.model.status.value;
    doo.model.status?.value !== undefined && colorizeStatus(doo.model.status.value, 'leadStatus');

    //status colors
    function colorizeStatus(status, className) {
        const statusClasses = {
            'Zrušený': ['tw-text-red-700', 'tw-ring-red-600/20', 'tw-bg-red-50'],
            'Převeden': ['tw-text-violet-700', 'tw-ring-violet-600/20', 'tw-bg-violet-50'],
            'Aktivní': ['tw-text-green-700', 'tw-ring-green-600/20', 'tw-bg-green-50'],
            'Nový': ['tw-text-cyan-700', 'tw-ring-cyan-600/20', 'tw-bg-cyan-50'],
            'Odložený': ['tw-text-orange-700', 'tw-ring-orange-600/20', 'tw-bg-orange-50']
        };

        const element = document.getElementById(className);

        Object.keys(statusClasses).forEach(key => {
            if (status.includes(key)) {
                element.classList.add(...statusClasses[key]);
            }
        });
    }

    document.getElementById("leadStatusDateChange").innerHTML = new Date(doo.model.dateOfLastChange.value).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' });
    //get initials for avatar
    function getInitials(firstName, lastName) {
        let initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        return initials;
    }

    //leadHistory for change to tw design
    const loadLeadCommHistoryTailwind = async (leadId, element) => {
        const commHistory = await doo.table.getData('leadCommunication', {
            filter: 'lead.id(eq)' + leadId,
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
            let communicationNote = (communication.fields.hasOwnProperty('note') ? communication.fields.note : '');
            let communicationEmailContent = communication.fields.communicationType == 'Email' ? '' : "N/A";
            //actually added for case of not working
            if (communication.fields.emailTemplate) {
                communicationEmailContent = communication.fields.emailTemplate;
            }

            if (communication.fields.communicationType == 'Email' && communicationNote == '') {
                communicationNote = (communication.fields.hasOwnProperty('emailTemplate') ? communication.fields.emailTemplate : 'N/A');
            }

            // Parse the element string
            const doc = parser.parseFromString(
                `<table communication-history">
                <tbody>
                    <tr>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                        <abbr title="${modifiedAtDate}  ${deadlineDate}" class="modified"><i class="far fa-calendar"></i> ${createdAtDate}</abbr>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="leadStatusNotes">
                        <span class="types">${communicationTypes}</span> 
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="leadStatusDateChange">
                        <span>${communicationOutcome ?? communicationEmailContent} ${communicationFolowUp}</span>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="leadStatusDateChange">
                        ${communicationNote}
                    </td>
                    </tr>
                </tbody>
                </table>`
                , 'text/html');
            doc.body.firstChild.rows[0].addEventListener('click', function () {
                doo.form.openForm('leadCommunication', { 'model': { 'id': communicationID } });
            });

            let firstRowTable = document.getElementById("tableHistory").getElementsByTagName("tbody")[0];
            firstRowTable.appendChild(doc.body.firstChild.rows[0]);
        });
        return true;
    }

    loadLeadCommHistoryTailwind(
        doo.model.id,
        document.getElementById(elementHistory)
    );

    const loadLeadTasks = async (leadId, element) => {
        const taskList = await doo.table.getData('task', {
            filter: 'lead.id(eq)' + leadId,
            limit: 10
        });




        element.innerHTML = `
    <div class="tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-mb-10">
        <div class="tw-mt-8 tw-flow-root">
            <div class="tw--mx-4 tw--my-2 sm:tw--mx-6 lg:tw--mx-8">
                <div class="tw-inline-block tw-min-w-full tw-py-2 tw-align-middle">
                    <table id="tableTasks" class="tw-min-w-full tw-border-separate border-spacing-0 task-list-lead">
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
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="leadStatusDateChange">
                        <span class="tw-inline-flex tw-items-center tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset task-status">${status}</span>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                        <span> ${nameTask} </span>
                    </td>
                    <td class="tw-whitespace-nowrap tw-border-b tw-border-gray-200 tw-hidden tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500 sm:tw-table-cell" id="leadStatusDateChange">
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

        const statusClasses = {
            'Hotovo': ['tw-text-green-700', 'tw-ring-green-600/20', 'tw-bg-green-50'],
            'V řešení': ['tw-text-cyan-700', 'tw-ring-cyan-600/20', 'tw-bg-cyan-50'],
            'Zadáno': ['tw-text-orange-700', 'tw-ring-orange-600/20', 'tw-bg-orange-50']
        };

        Array.from(taskStatusSpans).forEach(span => {
            Object.keys(statusClasses).forEach(status => {
                if (span.innerHTML.includes(status)) {
                    span.classList.add(...statusClasses[status]);
                }
            });
        });

        return true;
    }

    loadLeadTasks(
        doo.model.id,
        document.getElementById(elementTask)
    );
}

return {
    init,
};