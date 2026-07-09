const PAGE_CONFIG = {
    ris: {
        storageKey: 'ris_records',
        title: 'Requisition and Issue Slip',
        saveLabel: 'Save RIS',
        summaryFields: ['ris-no', 'entity-name', 'date'],
        dashboardFields: ['date', 'ris-no', 'entity-name', 'office', 'purpose'],
        rowFields: [
            {name: 'stock-no', label: 'Stock No.', type: 'text'},
            {name: 'unit', label: 'Unit', type: 'text'},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'quantity-requested', label: 'Quantity Requested', type: 'number'},
            {name: 'stock-available', label: 'Stock Available?', type: 'select', options: ['Yes', 'No']},
            {name: 'quantity-issued', label: 'Quantity Issued', type: 'number'},
            {name: 'remarks', label: 'Remarks', type: 'text'}
        ]
    },
    ics: {
        storageKey: 'ics_records',
        title: 'Inventory Custodian Slip',
        saveLabel: 'Save ICS',
        summaryFields: ['ics-no', 'entity-name', 'fund-cluster'],
        dashboardFields: ['ics-no', 'entity-name', 'fund-cluster', 'received-by-name'],
        rowFields: [
            {name: 'quantity', label: 'Quantity', type: 'number'},
            {name: 'unit', label: 'Unit', type: 'text'},
            {name: 'unit-cost', label: 'Unit Cost', type: 'number', step:'0.01'},
            {name: 'amount', label: 'Amount', type: 'number', step:'0.01', readonly:true},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'inventory-item-no', label: 'Inventory Item No.', type: 'text'},
            {name: 'estimated-useful-life', label: 'Estimated Useful Life', type: 'text'}
        ]
    },
    par: {
        storageKey: 'par_records',
        title: 'Property Acknowledgement Receipt',
        saveLabel: 'Save PAR',
        summaryFields: ['par-no', 'entity-name', 'fund-cluster'],
        dashboardFields: ['par-no', 'entity-name', 'fund-cluster', 'received-by-name'],
        rowFields: [
            {name: 'quantity', label: 'Quantity', type: 'number'},
            {name: 'unit', label: 'Unit', type: 'text'},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'property-number', label: 'Property Number', type: 'text'},
            {name: 'date-acquired', label: 'Date Acquired', type: 'date'},
            {name: 'amount', label: 'Amount', type: 'number', step:'0.01'}
        ]
    },
    'property-card': {
        storageKey: 'property_card_records',
        title: 'Property Card',
        saveLabel: 'Save Property Card',
        summaryFields: ['po-no', 'month', 'entity-name'],
        dashboardFields: ['po-no', 'month', 'entity-name', 'property-number'],
        rowFields: [
            {name: 'date', label: 'Date', type: 'date'},
            {name: 'reference-par-no', label: 'Reference PAR No.', type: 'text'},
            {name: 'receipt-qty', label: 'Receipt Qty', type: 'number'},
            {name: 'issue-transfer-disposal-qty', label: 'Issue/Transfer/Disposal Qty', type: 'number'},
            {name: 'balance-qty', label: 'Balance Qty', type: 'number'},
            {name: 'serial-number-amount', label: 'Serial Number / Amount', type: 'text'},
            {name: 'remarks', label: 'Remarks', type: 'text'}
        ]
    }
};

const EXTRA_PAGE_CONFIG = {
    iar: {
        storageKey: 'iar_records',
        title: 'Inspection and Acceptance Report',
        saveLabel: 'Save IAR',
        summaryFields: ['entity-name', 'fund-cluster', 'supplier'],
        dashboardFields: ['inspection-date', 'entity-name', 'supplier', 'status'],
        rowFields: [
            {name: 'stock-property-no', label: 'Stock/Property No.', type: 'text'},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'unit', label: 'Unit', type: 'text'},
            {name: 'quantity', label: 'Quantity', type: 'number'}
        ]
    },
    ptr: {
        storageKey: 'ptr_records',
        title: 'Property Transfer Report',
        saveLabel: 'Save PTR',
        summaryFields: ['ptr-no', 'entity-name', 'fund-cluster'],
        dashboardFields: ['date', 'ptr-no', 'entity-name', 'transfer-type', 'to-accountable-officer'],
        rowFields: [
            {name: 'date-acquired', label: 'Date Acquired', type: 'date'},
            {name: 'property-no', label: 'Property No.', type: 'text'},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'amount', label: 'Amount', type: 'number', step:'0.01'},
            {name: 'condition-of-ppe', label: 'Condition of PPE', type: 'text'}
        ]
    },
    prs: {
        storageKey: 'prs_records',
        title: 'Property Return Slip',
        saveLabel: 'Save PRS',
        summaryFields: ['entity-name', 'fund-cluster', 'purpose'],
        dashboardFields: ['purpose', 'entity-name', 'note', 'supply-officer-name'],
        rowFields: [
            {name: 'quantity', label: 'Quantity', type: 'number'},
            {name: 'unit', label: 'Unit', type: 'text'},
            {name: 'description', label: 'Description', type: 'text'},
            {name: 'property-number', label: 'Property Number', type: 'text'},
            {name: 'mr-number', label: 'M.R. Number', type: 'text'},
            {name: 'name-of-end-user', label: 'Name of End User', type: 'text'},
            {name: 'unit-value', label: 'Unit Value', type: 'number', step:'0.01'},
            {name: 'total-value', label: 'Total Value', type: 'number', step:'0.01'}
        ]
    }
};

function getPageConfig(pageKey) {
    return PAGE_CONFIG[pageKey] || EXTRA_PAGE_CONFIG[pageKey];
}

let editingId = null;
let cachedRecords = [];
let searchQuery = '';

function getPageKey() {
    return document.body.dataset.page;
}

function formatLabel(key) {
    return key.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatValue(value) {
    return escapeHtml(value || '-');
}

async function fetchRecords() {
    const { records } = await API.getRecords(getPageKey());
    cachedRecords = records;
    return records;
}

function findRecordById(id) {
    return cachedRecords.find(record => record.id === id);
}

function getRecordFormSection() {
    const form = document.getElementById('record-form');
    return form ? form.closest('section') : null;
}

function showRecordForm() {
    const formSection = getRecordFormSection();
    if (formSection) formSection.style.display = 'block';
}

function hideRecordForm() {
    const formSection = getRecordFormSection();
    if (formSection) formSection.style.display = 'none';
}

function isFormView() {
    return new URLSearchParams(window.location.search).get('view') === 'form';
}

function getEditIdFromUrl() {
    const value = new URLSearchParams(window.location.search).get('edit');
    const id = parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
}

function openFormPage(id = null) {
    const params = new URLSearchParams();
    params.set('view', 'form');
    if (id !== null) params.set('edit', id);
    window.location.href = `${window.location.pathname}?${params.toString()}`;
}

function openDashboardPage() {
    window.location.href = window.location.pathname;
}

function setDashboardVisible(isVisible) {
    const dashboard = document.querySelector('.slip-dashboard');
    const previewSection = document.getElementById('record-preview-section');

    if (dashboard) dashboard.style.display = isVisible ? '' : 'none';
    if (previewSection && !isVisible) previewSection.style.display = 'none';
}

function resetRecordForm(config, options = {}) {
    const form = document.getElementById('record-form');
    const tbody = document.querySelector('#detail-table tbody');

    if (form) form.reset();
    if (tbody) tbody.innerHTML = '';
    createRow(config);
    editingId = null;
    updateTotals();

    const previewSection = document.getElementById('record-preview-section');
    if (previewSection) previewSection.style.display = 'none';

    if (options.hideForm) hideRecordForm();
}

function createRow(config, itemData = {}) {
    const tbody = document.querySelector('#detail-table tbody');
    const row = document.createElement('tr');

    config.rowFields.forEach(field => {
        const cell = document.createElement('td');
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            field.options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                if (itemData[field.name] === option) optionEl.selected = true;
                select.appendChild(optionEl);
            });
            cell.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.name = field.name;
            input.placeholder = field.label;
            if (field.step) input.step = field.step;
            if (field.readonly) input.readOnly = true;
            input.classList.add('table-input');
            if (itemData[field.name]) input.value = itemData[field.name];
            cell.appendChild(input);
        }
        row.appendChild(cell);
    });

    const actionCell = document.createElement('td');
    actionCell.innerHTML = '<button type="button" class="delete-row">Delete</button>';
    row.appendChild(actionCell);
    tbody.appendChild(row);

    if (config.storageKey === 'ics_records') {
        const quantityInput = row.querySelector('input[name="quantity"]');
        const costInput = row.querySelector('input[name="unit-cost"]');
        const amountInput = row.querySelector('input[name="amount"]');
        const updateAmount = () => {
            const qty = parseFloat(quantityInput.value) || 0;
            const cost = parseFloat(costInput.value) || 0;
            amountInput.value = (qty * cost).toFixed(2);
            updateTotals();
        };

        quantityInput.addEventListener('input', updateAmount);
        costInput.addEventListener('input', updateAmount);
        if (amountInput.value === '') updateAmount();
    }
}

function updateTotals() {
    const totalField = document.getElementById('total-amount');
    if (!totalField) return;
    const rows = document.querySelectorAll('#detail-table tbody tr');
    let total = 0;
    rows.forEach(row => {
        const amountInput = row.querySelector('input[name="amount"]');
        if (amountInput) {
            total += parseFloat(amountInput.value) || 0;
        }
    });
    totalField.textContent = total.toFixed(2);
}

function gatherFormData(config) {
    const formData = {};
    config.summaryFields.concat(getExtraFormFields(config)).forEach(id => {
        const element = document.getElementById(id);
        if (element) formData[id] = element.value.trim();
    });
    return formData;
}

function getExtraFormFields(config) {
    const ids = [];
    const inputs = document.querySelectorAll('#record-form input, #record-form select, #record-form textarea');
    inputs.forEach(input => {
        const id = input.id;
        if (id && !config.summaryFields.includes(id) && !ids.includes(id)) {
            ids.push(id);
        }
    });
    return ids;
}

function gatherTableRows(config) {
    const rows = [];
    const trList = document.querySelectorAll('#detail-table tbody tr');
    trList.forEach(row => {
        const rowData = {};
        config.rowFields.forEach(field => {
            const element = row.querySelector(`[name="${field.name}"]`);
            rowData[field.name] = element ? element.value.trim() : '';
        });
        const hasValue = Object.values(rowData).some(value => value !== '');
        if (hasValue) rows.push(rowData);
    });
    return rows;
}

function renderRecords(config) {
    const filteredRecords = getFilteredRecords(cachedRecords, searchQuery);
    renderRecordsTable(config, filteredRecords);
    renderSummaryStats(config);
}

function getFilteredRecords(records, query) {
    const text = String(query || '').trim().toLowerCase();
    if (!text) return records;

    return records.filter(record => {
        const recordValues = Object.entries(record)
            .filter(([key]) => key !== 'items')
            .map(([, value]) => String(value || ''))
            .join(' ')
            .toLowerCase();

        const itemValues = (record.items || [])
            .map(item => Object.values(item).join(' '))
            .join(' ')
            .toLowerCase();

        return recordValues.includes(text) || itemValues.includes(text);
    });
}

function addSearchInput(config) {
    const panel = document.querySelector('.dashboard-panel');
    if (!panel || document.getElementById('record-search')) return;

    const row = document.createElement('div');
    row.className = 'search-row';
    row.innerHTML = `
        <input id="record-search" type="search" placeholder="Search saved records..." value="${searchQuery}">
    `;

    panel.insertBefore(row, panel.querySelector('.dashboard-stats'));
    document.getElementById('record-search').addEventListener('input', event => {
        searchQuery = event.target.value || '';
        renderRecords(config);
    });
}

function renderRecordsTable(config, records = []) {
    const recordsTableBody = document.querySelector('#records-table tbody');
    const stored = records;
    const dashboardFields = config.dashboardFields || config.summaryFields;

    if (!recordsTableBody) return;
    recordsTableBody.innerHTML = '';

    if (stored.length === 0) {
        recordsTableBody.innerHTML = `<tr id="records-table-empty"><td colspan="${dashboardFields.length + 2}" class="empty-state">No records saved yet.</td></tr>`;
        return;
    }

    stored.forEach((record, index) => {
        const row = document.createElement('tr');
        const cells = dashboardFields.map(field => `<td>${formatValue(record[field])}</td>`).join('');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="action-group">
                    <button type="button" class="action-button" data-action="download" data-id="${record.id}">Download PDF</button>
                    <button type="button" class="action-button" data-action="print" data-id="${record.id}">Print</button>
                    <button type="button" class="action-button" data-action="view" data-id="${record.id}">View</button>
                    <button type="button" class="action-button" data-action="edit" data-id="${record.id}">Edit</button>
                </div>
            </td>
        `;
        row.insertAdjacentHTML('afterbegin', cells);
        recordsTableBody.appendChild(row);
    });
}

function renderSummaryStats(config) {
    const stored = cachedRecords;
    const totalRecords = document.getElementById('total-records');
    const recentSlip = document.getElementById('recent-slip');
    const currentStatus = document.getElementById('current-status');

    if (totalRecords) totalRecords.textContent = stored.length;
    if (recentSlip) {
        if (stored.length === 0) {
            recentSlip.textContent = '-';
        } else {
            const recent = stored[0];
            recentSlip.textContent = recent[config.summaryFields[0]] || recent['entity-name'] || 'Latest';
        }
    }
    if (currentStatus) {
        currentStatus.textContent = stored.length === 0 ? 'Ready' : 'Has Records';
    }
}

function renderRecordDetails(config, id) {
    const record = findRecordById(id);
    const previewSection = document.getElementById('record-preview-section');
    const preview = document.getElementById('record-preview');

    if (!record || !previewSection || !preview) return;

    preview.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'record-preview-summary';
    Object.keys(record).forEach(key => {
        if (key === 'items' || key === 'createdAt') return;
        const row = document.createElement('div');
        row.innerHTML = `<strong>${formatLabel(key)}:</strong> ${formatValue(record[key])}`;
        summary.appendChild(row);
    });

    const itemsSection = document.createElement('div');
    itemsSection.className = 'record-preview-items';
    itemsSection.innerHTML = '<h4>Item Details</h4>';
    if (record.items && record.items.length) {
        record.items.forEach(item => {
            const itemBlock = document.createElement('div');
            itemBlock.className = 'preview-item';
            itemBlock.innerHTML = config.rowFields.map(field => `<div><strong>${field.label}:</strong> ${formatValue(item[field.name])}</div>`).join('');
            itemsSection.appendChild(itemBlock);
        });
    } else {
        itemsSection.innerHTML += '<div>No items available.</div>';
    }

    const actions = document.createElement('div');
    actions.className = 'preview-actions';
    actions.innerHTML = `
        <button type="button" id="preview-edit">Edit Slip</button>
        <button type="button" id="preview-download">Download PDF</button>
        <button type="button" id="preview-print">Print</button>
        <button type="button" id="preview-delete" class="danger">Delete Slip</button>
        <button type="button" id="preview-close" class="secondary">Close</button>
    `;

    preview.innerHTML = '';
    preview.appendChild(summary);
    preview.appendChild(itemsSection);
    preview.appendChild(actions);
    previewSection.style.display = 'block';

    document.getElementById('preview-edit').addEventListener('click', () => startEditRecord(config, id));
    document.getElementById('preview-download').addEventListener('click', () => generatePdf(config, record, 'download'));
    document.getElementById('preview-print').addEventListener('click', () => generatePdf(config, record, 'print'));
    document.getElementById('preview-delete').addEventListener('click', () => deleteRecord(config, id));
    document.getElementById('preview-close').addEventListener('click', () => {
        previewSection.style.display = 'none';
    });
}

function showFormForEdit(record, config, id) {
    showRecordForm();

    config.summaryFields.concat(getExtraFormFields(config)).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) element.value = record[fieldId] || '';
    });

    document.querySelector('#detail-table tbody').innerHTML = '';
    (record.items || []).forEach(item => createRow(config, item));
    editingId = id;
}

function startEditRecord(config, id) {
    openFormPage(id);
}

async function deleteRecord(config, id) {
    const record = findRecordById(id);

    if (!record) return;
    if (!confirm(`Delete this ${config.title}?`)) return;

    await API.deleteRecord(getPageKey(), id);
    await fetchRecords();

    if (editingId === id) {
        resetRecordForm(config);
    }

    editingId = null;
    const previewSection = document.getElementById('record-preview-section');
    if (previewSection) previewSection.style.display = 'none';
    renderRecords(config);
    alert(`${config.title} deleted.`);
}

function buildPrintableRecord(config) {
    return {
        ...gatherFormData(config),
        items: gatherTableRows(config),
        createdAt: new Date().toISOString()
    };
}

function generatePdf(config, record, mode = 'print') {
    if (!record) {
        alert('No record is available to print.');
        return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups for this page, then try again.');
        return;
    }

    const html = `
        <html>
        <head>
            <title>${config.title}</title>
            <style>
                * { box-sizing: border-box; }
                body { font-family: Arial, sans-serif; color: #111; padding: 24px; background: #f8f9ff; }
                .print-logo { width: 72px; height: 72px; margin: 0 auto 12px; position: relative; display: grid; place-items: center; border-radius: 18px; background: #ffffff; border: 1px solid rgba(80,110,150,0.2); box-shadow: 0 10px 24px rgba(15,34,58,0.12); overflow: hidden; }
                .print-logo::before { content: ''; position: absolute; inset: 12px; border-radius: 14px; background-image: linear-gradient(90deg, rgba(52,83,140,0.16) 0 18%, transparent 18% 36%, rgba(120,155,208,0.16) 36% 52%, transparent 52% 68%, rgba(57,88,142,0.16) 68% 84%, transparent 84% 100%), linear-gradient(180deg, rgba(120,155,208,0.14) 0 20%, transparent 20% 40%, rgba(52,83,140,0.12) 40% 58%, transparent 58% 78%, rgba(76,121,182,0.14) 78% 100%); background-size: 100% 100%; }
                .print-logo span { position: relative; z-index: 1; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: #f8f9ff; color: #4f6c9d; font-weight: 800; font-size: 18px; }
                h1 { font-size: 22px; text-align: center; margin-bottom: 24px; }
                h2 { font-size: 16px; margin-bottom: 8px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                td, th { border: 1px solid #444; padding: 8px; font-size: 12px; vertical-align: top; }
                th { background: #f2f2f2; }
                .details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 24px; }
                .details div { font-size: 13px; }
                .section { margin-top: 18px; }
                @media print {
                    body { padding: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-logo"><span>MC</span></div>
            <h1>${escapeHtml(config.title)}</h1>
            <div class="details">
                ${Object.keys(record).filter(key => key !== 'items' && key !== 'createdAt').map(key => `<div><strong>${formatLabel(key)}:</strong> ${formatValue(record[key])}</div>`).join('')}
            </div>
            <div class="section">
                <h2>Items</h2>
                <table>
                    <thead><tr>${config.rowFields.map(field => `<th>${escapeHtml(field.label)}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${(record.items || []).length
                            ? record.items.map(item => `<tr>${config.rowFields.map(field => `<td>${formatValue(item[field.name])}</td>`).join('')}</tr>`).join('')
                            : `<tr><td colspan="${config.rowFields.length}">No items encoded.</td></tr>`}
                    </tbody>
                </table>
            </div>
            <script>
                window.addEventListener('load', () => {
                    window.focus();
                    ${mode === 'download' ? "document.title = '" + escapeHtml(config.title) + "';" : ''}
                    setTimeout(() => window.print(), 100);
                });
            <\/script>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
}

function addCurrentFormPrintButton(config) {
    const buttonRow = document.querySelector('#record-form .button-row');
    if (!buttonRow || document.getElementById('print-current-record')) return;

    const printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.id = 'print-current-record';
    printButton.className = 'secondary';
    printButton.textContent = 'Print';
    printButton.addEventListener('click', () => {
        generatePdf(config, buildPrintableRecord(config), 'print');
    });
    buttonRow.appendChild(printButton);

    const downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.id = 'download-current-record';
    downloadButton.className = 'secondary';
    downloadButton.textContent = 'Download PDF';
    downloadButton.addEventListener('click', () => {
        generatePdf(config, buildPrintableRecord(config), 'download');
    });
    buttonRow.appendChild(downloadButton);

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.id = 'back-to-record-dashboard';
    backButton.className = 'secondary';
    backButton.textContent = 'Back to Dashboard';
    backButton.addEventListener('click', () => {
        openDashboardPage();
    });
    buttonRow.appendChild(backButton);
}

function populateRecordTableConfig() {
    const table = document.getElementById('records-table');
    if (!table) return;
    const head = table.querySelector('thead');
    if (!head) return;
    const config = getPageConfig(document.body.dataset.page);
    const dashboardFields = config.dashboardFields || config.summaryFields;
    head.innerHTML = `
        <tr>
            ${dashboardFields.map(field => `<th>${formatLabel(field)}</th>`).join('')}
            <th>#</th>
            <th>Action</th>
        </tr>
    `;
}

function removeSignatureFields() {
    document.querySelectorAll('#record-form label').forEach(label => {
        if (!label.textContent.toLowerCase().includes('signature')) return;
        const field = label.closest('div');
        if (field) field.remove();
    });

    document.querySelectorAll('#record-form h3').forEach(heading => {
        heading.textContent = heading.textContent.replace(/ and Signatures/gi, '');
    });
}

function addHeaderLogo() {
    const header = document.querySelector('.dashboard-header');
    if (!header || header.querySelector('.form-logo')) return;
    const logo = document.createElement('div');
    logo.className = 'form-logo';
    logo.innerHTML = '<span>MC</span>';
    header.prepend(logo);
}

function showAccessDenied(config) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <div class="form-logo"><span>MC</span></div>
            <h1>${escapeHtml(config.title)}</h1>
        </div>
        <section>
            <h3>Access Restricted</h3>
            <p class="empty-state">Your account can only access forms assigned by the administrator.</p>
            <div class="button-row">
                <button type="button" onclick="window.location.href='index.html'">Back to Dashboard</button>
            </div>
        </section>
    `;
}

async function initFormPage() {
    const user = await requireAuth();
    if (!user) return;

    const pageKey = getPageKey();
    const config = getPageConfig(pageKey);
    if (!config) return;

    if (!canAccessForm(user, pageKey)) {
        showAccessDenied(config);
        return;
    }

    const headerTitle = document.querySelector('.dashboard-header h1');
    const saveButton = document.querySelector('#record-form button[type="submit"]');
    if (headerTitle) headerTitle.textContent = `${config.title}`;
    if (saveButton) saveButton.textContent = config.saveLabel;

    addHeaderLogo();
    removeSignatureFields();
    populateRecordTableConfig();
    addCurrentFormPrintButton(config);
    addSearchInput(config);
    hideRecordForm();

    document.getElementById('add-row').addEventListener('click', () => createRow(config));
    const createNew = document.getElementById('create-new-record');
    if (createNew) {
        createNew.addEventListener('click', () => {
            openFormPage();
        });
    }

    document.getElementById('record-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = gatherFormData(config);
        const items = gatherTableRows(config);
        if (items.length === 0) {
            alert('Please add at least one line item.');
            return;
        }

        const payload = { ...formData, items };

        if (editingId !== null) {
            const existing = findRecordById(editingId);
            await API.updateRecord(getPageKey(), editingId, {
                ...payload,
                createdAt: existing?.createdAt || new Date().toISOString()
            });
            editingId = null;
            alert(`${config.title} updated.`);
        } else {
            await API.createRecord(getPageKey(), {
                ...payload,
                createdAt: new Date().toISOString()
            });
            alert(`${config.title} saved.`);
        }

        openDashboardPage();
    });

    document.getElementById('records-table').addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        const id = parseInt(event.target.dataset.id, 10);
        if (!action || Number.isNaN(id)) return;
        if (action === 'view') {
            renderRecordDetails(config, id);
        }
        if (action === 'edit') {
            startEditRecord(config, id);
        }
        if (action === 'download' || action === 'print') {
            const record = findRecordById(id);
            if (record) generatePdf(config, record, action);
        }
    });

    document.getElementById('clear-form').addEventListener('click', () => {
        resetRecordForm(config);
    });

    document.querySelector('#detail-table tbody').addEventListener('click', (event) => {
        if (event.target.matches('.delete-row')) {
            event.target.closest('tr').remove();
            updateTotals();
        }
    });

    createRow(config);
    await fetchRecords();
    renderRecords(config);
    updateTotals();

    if (isFormView()) {
        setDashboardVisible(false);
        const editId = getEditIdFromUrl();
        if (editId !== null) {
            const record = findRecordById(editId);
            if (record) {
                showFormForEdit(record, config, editId);
            } else {
                openDashboardPage();
            }
        } else {
            showRecordForm();
        }
    } else {
        setDashboardVisible(true);
        hideRecordForm();
    }
}

window.addEventListener('DOMContentLoaded', initFormPage);
