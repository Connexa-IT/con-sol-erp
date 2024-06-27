
const init = async () => {
    const body = document.querySelector(".TBD-RANDOM-ID-wrap");

    const getFixedTime = (date) => {
        const fixedDate = new Date(date);
        fixedDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        console.log("OFFSET", date.getTimezoneOffset());
        return fixedDate.toISOString().slice(0, 16);
    };

    const changeHandler = async () => {
        doo.model.taskName.setValue(document.querySelector("#task_name").value);
        doo.model.status.setValue(document.querySelector("#status").value);

        //Datumy/Časy
        console.log(new Date(document.querySelector("#deadline").value));
        doo.model.deadline.setValue(
            new Date(document.querySelector("#deadline").value)
        );
        doo.model.createdDate.setValue(document.querySelector("#created").value);
        doo.model.whenSolved.setValue(document.querySelector("#solved_date").value);

        //Vazby
        /* doo.model.salesRepresentative.setValue(document.querySelector('#solver').value)
            doo.model.komunikaceKlient.setValue(document.querySelector('#communicationClient').value)
            doo.model.leadcontact.setValue(document.querySelector('#communicationLead').value)
            doo.model.employee.setValue(document.querySelector('#solved_by').value)
            doo.model.klient.setValue(document.querySelector('#client').value)
            doo.model.lead.setValue(document.querySelector('#lead').value) */

        await doo.form.updateCalculatedFields();
    };

    const initialize = async () => {
        const salesRepresentatives = await doo.table.getData(
            "salesRepresentative",
            { limit: 1000 }
        );
        const solverElement = document.querySelector("#solver");
        const solvedByElement = document.querySelector("#solved_by");

        salesRepresentatives?.data?.forEach((item) => {
            solverElement.innerHTML += `<option value="${item?.id}">${item.fields?.firstname} ${item.fields?.surname}</option>`;
            solvedByElement.innerHTML += `<option value="${item?.id}">${item.fields?.firstname} ${item.fields?.surname}</option>`;
        });

        const data = {
            task_name: doo.model.taskName?.value ?? "",
            created: doo.model.createdDate?.value ?? "",
            deadline: doo.model.deadline?.value ?? "",
            solver: doo.model.salesRepresentative?.value?.id ?? "",
            client: doo.model.client?.value?.id ?? "",
            lead: doo.model.lead?.value?.id ?? "",
            status: doo.model.status?.value ?? "",
            note: doo.model.note?.value ?? "",
            communicationLead: doo.model.leadCommunication?.value?.id ?? "",
            communicationClient: doo.model.clientCommunication?.value?.id ?? "",
            solved_date: doo.model.whenSolved?.value ?? "",
        };

        console.log(data);

        Object.keys(data).forEach((item) => {
            const element = document.querySelector(`#${item}`);
            if (
                element instanceof HTMLInputElement &&
                element.type === "datetime-local" &&
                data[item]
            ) {
                const date = new Date(data[item]);
                element.value = String(date.toISOString().slice(0, 16));
            }

            if (element instanceof HTMLInputElement && element.type === "text") {
                element.value = data[item];
            }

            if (element instanceof HTMLSelectElement) {
                console.log(data[item]);
                element.value = data[item];
            }

            if (element instanceof HTMLTextAreaElement) {
                element.value = data[item];
            }
        });

        const inputs = document.querySelectorAll("input, select, textarea");
        inputs.forEach((item) => item.addEventListener("change", changeHandler));
        console.log(data);
    };
    initialize();
};

return {
    init,
};
