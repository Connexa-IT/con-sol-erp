interface IConnWidgets {
    loadLeadCommHistory: (leadId: number, element: HTMLElement) => boolean;
    loadClientCommHistory: (clientId: number, element: HTMLElement) => boolean;
 }