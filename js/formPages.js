const PAGE_CONFIG = {
    ris: {
        storageKey: 'ris_records',
        title: 'Requisition and Issue Slip',
        saveLabel: 'Save RIS',
        summaryFields: ['ris-no', 'entity-name', 'date'],
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

let editingIndex = null;

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
    renderRecordsTable(config);
    renderSummaryStats(config);
}

function renderRecordsTable(config) {
    const recordsTableBody = document.querySelector('#records-table tbody');
    const emptyState = document.querySelector('#records-table-empty');
    const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');

    if (!recordsTableBody) return;
    recordsTableBody.innerHTML = '';

    if (stored.length === 0) {
        if (emptyState) emptyState.style.display = 'table-row';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';

    stored.forEach((record, index) => {
        const row = document.createElement('tr');
        const title = config.summaryFields.map(key => record[key]).filter(Boolean).join(' - ') || config.title;
        const entity = record['entity-name'] || '-';
        const date = record.date || record['date-acquired'] || record['requested-by-date'] || record['createdAt'] ? new Date(record.createdAt).toLocaleDateString() : '-';
        const status = record.status || record['purpose'] || '-';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${title}</td>
            <td>${entity}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <button type="button" class="action-button" data-action="view" data-index="${index}">View</button>
                <button type="button" class="action-button" data-action="edit" data-index="${index}">Edit</button>
                <button type="button" class="action-button" data-action="pdf" data-index="${index}">Generate PDF</button>
            </td>
        `;
        recordsTableBody.appendChild(row);
    });
}

function renderSummaryStats(config) {
    const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
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

function renderRecordDetails(config, index) {
    const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
    const record = stored[index];
    const previewSection = document.getElementById('record-preview-section');
    const preview = document.getElementById('record-preview');

    if (!record || !previewSection || !preview) return;

    preview.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'record-preview-summary';
    Object.keys(record).forEach(key => {
        if (key === 'items' || key === 'createdAt') return;
        const row = document.createElement('div');
        row.innerHTML = `<strong>${formatLabel(key)}:</strong> ${record[key] || '-'}`;
        summary.appendChild(row);
    });

    const itemsSection = document.createElement('div');
    itemsSection.className = 'record-preview-items';
    itemsSection.innerHTML = '<h4>Item Details</h4>';
    if (record.items && record.items.length) {
        record.items.forEach(item => {
            const itemBlock = document.createElement('div');
            itemBlock.className = 'preview-item';
            itemBlock.innerHTML = config.rowFields.map(field => `<div><strong>${field.label}:</strong> ${item[field.name] || '-'}</div>`).join('');
            itemsSection.appendChild(itemBlock);
        });
    } else {
        itemsSection.innerHTML += '<div>No items available.</div>';
    }

    const actions = document.createElement('div');
    actions.className = 'preview-actions';
    actions.innerHTML = `
        <button type="button" id="preview-edit">Edit Slip</button>
        <button type="button" id="preview-pdf">Generate PDF</button>
    `;

    preview.innerHTML = '';
    preview.appendChild(summary);
    preview.appendChild(itemsSection);
    preview.appendChild(actions);
    previewSection.style.display = 'block';

    document.getElementById('preview-edit').addEventListener('click', () => startEditRecord(config, index));
    document.getElementById('preview-pdf').addEventListener('click', () => generatePdf(config, record));
}

function showFormForEdit(record, config, index) {
    const form = document.getElementById('record-form');
    form.scrollIntoView({ behavior: 'smooth' });

    config.summaryFields.concat(getExtraFormFields(config)).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = record[id] || '';
    });

    document.querySelector('#detail-table tbody').innerHTML = '';
    record.items.forEach(item => createRow(config, item));
    editingIndex = index;
}

function startEditRecord(config, index) {
    const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
    const record = stored[index];
    if (!record) return;
    showFormForEdit(record, config, index);
}

function generatePdf(config, record) {
    const printWindow = window.open('', '_blank');
    const html = `
        <html>
        <head>
            <title>${config.title}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { font-size: 22px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                td, th { border: 1px solid #ccc; padding: 8px; }
                .section { margin-top: 18px; }
            </style>
        </head>
        <body>
            <h1>${config.title}</h1>
            ${Object.keys(record).filter(key => key !== 'items' && key !== 'createdAt').map(key => `<div><strong>${formatLabel(key)}:</strong> ${record[key] || '-'}</div>`).join('')}
            <div class="section">
                <h2>Items</h2>
                <table>
                    <thead><tr>${config.rowFields.map(field => `<th>${field.label}</th>`).join('')}</tr></thead>
                    <tbody>${record.items.map(item => `<tr>${config.rowFields.map(field => `<td>${item[field.name] || '-'}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function populateRecordTableConfig() {
    const table = document.getElementById('records-table');
    if (!table) return;
    const head = table.querySelector('thead');
    if (!head) return;
    head.innerHTML = `
        <tr>
            <th>#</th>
            <th>Slip</th>
            <th>Entity</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    `;
}

function initFormPage() {
    const pageKey = document.body.dataset.page;
    const config = getPageConfig(pageKey);
    if (!config) return;

    const headerTitle = document.querySelector('.dashboard-header h1');
    const saveButton = document.querySelector('#record-form button[type="submit"]');
    if (headerTitle) headerTitle.textContent = `${config.title}`;
    if (saveButton) saveButton.textContent = config.saveLabel;

    populateRecordTableConfig();

    document.getElementById('add-row').addEventListener('click', () => createRow(config));
    const createNew = document.getElementById('create-new-record');
    if (createNew) {
        createNew.addEventListener('click', () => {
            document.getElementById('record-form').reset();
            document.querySelector('#detail-table tbody').innerHTML = '';
            createRow(config);
            editingIndex = null;
            updateTotals();
            document.getElementById('record-form').scrollIntoView({ behavior: 'smooth' });
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
        const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
        if (editingIndex !== null) {
            stored[editingIndex] = {
                ...formData,
                items,
                createdAt: stored[editingIndex].createdAt || new Date().toISOString()
            };
            editingIndex = null;
            alert(`${config.title} updated.`);
        } else {
            stored.unshift({
                ...formData,
                items,
                createdAt: new Date().toISOString()
            });
            alert(`${config.title} saved.`);
        }
        localStorage.setItem(config.storageKey, JSON.stringify(stored));
        document.getElementById('record-form').reset();
        document.querySelector('#detail-table tbody').innerHTML = '';
        createRow(config);
        updateTotals();
        renderRecords(config);
    });

    document.getElementById('records-table').addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        const index = parseInt(event.target.dataset.index, 10);
        if (!action || isNaN(index)) return;
        if (action === 'view') {
            renderRecordDetails(config, index);
        }
        if (action === 'edit') {
            startEditRecord(config, index);
        }
        if (action === 'pdf') {
            const stored = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
            generatePdf(config, stored[index]);
        }
    });

    document.getElementById('clear-form').addEventListener('click', () => {
        document.getElementById('record-form').reset();
        document.querySelector('#detail-table tbody').innerHTML = '';
        createRow(config);
        editingIndex = null;
        updateTotals();
    });

    document.querySelector('#detail-table tbody').addEventListener('click', (event) => {
        if (event.target.matches('.delete-row')) {
            event.target.closest('tr').remove();
            updateTotals();
        }
    });

    createRow(config);
    renderRecords(config);
    updateTotals();
}

window.addEventListener('DOMContentLoaded', initFormPage);
