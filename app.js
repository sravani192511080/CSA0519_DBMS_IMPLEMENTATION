(function () {
    "use strict";

    const STORAGE_KEY = "bloodBankPagesDemo.v1";
    const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const app = document.getElementById("app");
    const toast = document.getElementById("toast");
    let state;
    let toastTimer;

    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    function createSeedData() {
        return {
            donors: [
                { id: 3, name: "Jordan Lee", age: 31, gender: "Other", bloodGroup: "O+", phone: "000-000-0000", email: "jordan@example.invalid", address: "Sample address" },
                { id: 2, name: "Sam Taylor", age: 26, gender: "Female", bloodGroup: "B+", phone: "000-000-0000", email: "sam@example.invalid", address: "Sample address" },
                { id: 1, name: "Alex Morgan", age: 29, gender: "Male", bloodGroup: "A+", phone: "000-000-0000", email: "alex@example.invalid", address: "Sample address" }
            ],
            inventory: [
                { group: "A+", units: 12, updated: today() },
                { group: "A-", units: 5, updated: today() },
                { group: "B+", units: 9, updated: today() },
                { group: "B-", units: 4, updated: today() },
                { group: "AB+", units: 6, updated: today() },
                { group: "AB-", units: 2, updated: today() },
                { group: "O+", units: 15, updated: today() },
                { group: "O-", units: 3, updated: today() }
            ],
            requests: [
                { id: 103, patient: "Casey Example", hospital: "Northside Clinic", bloodGroup: "O-", units: 1, date: today(), status: "Rejected" },
                { id: 102, patient: "Riley Example", hospital: "Community Hospital", bloodGroup: "B+", units: 3, date: today(), status: "Approved" },
                { id: 101, patient: "Avery Example", hospital: "City Medical Centre", bloodGroup: "A+", units: 2, date: today(), status: "Pending" }
            ],
            issues: [
                { id: 1, requestId: 102, units: 1, date: today() }
            ]
        };
    }

    function validState(value) {
        return value &&
            Array.isArray(value.donors) &&
            Array.isArray(value.inventory) &&
            Array.isArray(value.requests) &&
            Array.isArray(value.issues);
    }

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) {
            const initial = createSeedData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            return initial;
        }

        const parsed = JSON.parse(saved);
        if (!validState(parsed)) {
            throw new Error("Saved demo data is invalid. Use “Reset demo data” to restore it.");
        }
        return parsed;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showToast(message, isError) {
        toast.textContent = message;
        toast.classList.toggle("toast-error", Boolean(isError));
        toast.classList.add("toast-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("toast-visible");
        }, 3500);
    }

    function commit(change, successMessage) {
        try {
            const next = JSON.parse(JSON.stringify(state));
            change(next);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            state = next;
            render();
            showToast(successMessage, false);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Could not save this change.", true);
        }
    }

    function nextId(items) {
        return items.reduce(function (max, item) {
            return Math.max(max, Number(item.id) || 0);
        }, 0) + 1;
    }

    function getInventory(group, data) {
        return data.inventory.find(function (item) { return item.group === group; });
    }

    function issuedFor(requestId, data) {
        return data.issues.reduce(function (total, issue) {
            return total + (Number(issue.requestId) === Number(requestId) ? Number(issue.units) : 0);
        }, 0);
    }

    function remainingFor(request, data) {
        return Number(request.units) - issuedFor(request.id, data);
    }

    function pageTitle(title, description, action) {
        return '<div class="page-heading"><div><p class="eyebrow">Blood Bank Management</p>' +
            '<h1>' + escapeHtml(title) + '</h1><p class="page-description">' + escapeHtml(description) + '</p></div>' +
            (action || "") + '</div>';
    }

    function table(headers, rows, emptyMessage) {
        if (!rows.length) {
            return '<div class="empty-state">' + escapeHtml(emptyMessage) + '</div>';
        }
        return '<div class="table-wrap"><table><thead><tr>' +
            headers.map(function (header) { return "<th>" + escapeHtml(header) + "</th>"; }).join("") +
            "</tr></thead><tbody>" + rows.join("") + "</tbody></table></div>";
    }

    function bloodGroupOptions(selected) {
        return BLOOD_GROUPS.map(function (group) {
            return '<option value="' + group + '"' + (group === selected ? " selected" : "") + ">" + group + "</option>";
        }).join("");
    }

    function dashboard() {
        const totalStock = state.inventory.reduce(function (sum, item) { return sum + Number(item.units); }, 0);
        const pending = state.requests.filter(function (request) { return request.status === "Pending"; }).length;
        const cards = [
            ["Registered donors", state.donors.length, "Across all blood groups"],
            ["Blood groups", state.inventory.length, "Tracked in inventory"],
            ["Available units", totalStock, "Current total stock"],
            ["Blood requests", state.requests.length, "All request statuses"],
            ["Pending requests", pending, "Awaiting a decision"]
        ];
        const rows = state.inventory.map(function (item) {
            return "<tr><td><span class=\"blood-type\">" + escapeHtml(item.group) + "</span></td><td>" +
                escapeHtml(item.units) + "</td><td>" + escapeHtml(item.updated) + "</td></tr>";
        });
        return pageTitle("Dashboard", "A quick overview of donors, stock, and blood requests.") +
            '<section class="stat-grid">' + cards.map(function (card) {
                return '<article class="stat-card"><span>' + escapeHtml(card[0]) + '</span><strong>' +
                    escapeHtml(card[1]) + '</strong><small>' + escapeHtml(card[2]) + '</small></article>';
            }).join("") + "</section>" +
            '<section class="panel"><div class="section-heading"><div><h2>Blood stock overview</h2>' +
            '<p>Units available by blood group</p></div><a class="button button-secondary" href="#inventory">Manage inventory</a></div>' +
            table(["Blood group", "Units available", "Last updated"], rows, "No inventory records yet.") +
            '</section><section class="quick-actions"><a class="quick-action" href="#donor-new"><strong>＋ Add donor</strong><span>Register a blood donor</span></a>' +
            '<a class="quick-action" href="#request-new"><strong>＋ New request</strong><span>Submit a blood request</span></a>' +
            '<a class="quick-action" href="#issues"><strong>Issue blood</strong><span>Fulfil an approved request</span></a></section>';
    }

    function donorList() {
        const rows = state.donors.map(function (donor) {
            return "<tr><td>" + escapeHtml(donor.id) + "</td><td><strong>" + escapeHtml(donor.name) +
                "</strong></td><td>" + escapeHtml(donor.age) + "</td><td>" + escapeHtml(donor.gender) +
                '</td><td><span class="blood-type">' + escapeHtml(donor.bloodGroup) + "</span></td><td>" +
                escapeHtml(donor.phone) + "</td><td>" + escapeHtml(donor.email || "—") + "</td><td>" +
                escapeHtml(donor.address || "—") + '</td><td class="actions"><a href="#donor-edit/' +
                encodeURIComponent(donor.id) + '">Edit</a><button class="link-button danger-text" type="button" data-action="delete-donor" data-id="' +
                escapeHtml(donor.id) + '">Delete</button></td></tr>';
        });
        return pageTitle("Registered donors", "Add, update, and remove donor records.",
                '<a class="button" href="#donor-new">Add donor</a>') +
            '<section class="panel">' + table(["ID", "Name", "Age", "Gender", "Blood group", "Phone", "Email", "Address", "Actions"], rows, "No donors have been added.") + "</section>";
    }

    function donorForm(donor) {
        const isEdit = Boolean(donor);
        const title = isEdit ? "Edit donor" : "Add a donor";
        const action = isEdit ? "donor-update" : "donor-create";
        return pageTitle(title, isEdit ? "Update the donor details below." : "Enter the details to register a donor.") +
            '<section class="panel form-panel"><form data-form="' + action + '" data-id="' + (isEdit ? escapeHtml(donor.id) : "") + '">' +
            '<div class="form-grid">' +
            '<label>Full name<input name="name" type="text" maxlength="100" required value="' + escapeHtml(isEdit ? donor.name : "") + '"></label>' +
            '<label>Age<input name="age" type="number" min="1" max="120" required value="' + escapeHtml(isEdit ? donor.age : "") + '"></label>' +
            '<label>Gender<select name="gender" required>' + ["Male", "Female", "Other"].map(function (gender) {
                return '<option value="' + gender + '"' + (isEdit && donor.gender === gender ? " selected" : "") + ">" + gender + "</option>";
            }).join("") + '</select></label>' +
            '<label>Blood group<select name="bloodGroup" required>' + bloodGroupOptions(isEdit ? donor.bloodGroup : "A+") + "</select></label>" +
            '<label>Phone<input name="phone" type="tel" maxlength="40" required value="' + escapeHtml(isEdit ? donor.phone : "") + '"></label>' +
            '<label>Email <span class="optional">(optional)</span><input name="email" type="email" maxlength="120" value="' + escapeHtml(isEdit ? donor.email : "") + '"></label>' +
            '<label class="form-span">Address <span class="optional">(optional)</span><input name="address" type="text" maxlength="200" value="' + escapeHtml(isEdit ? donor.address : "") + '"></label>' +
            '</div><div class="form-actions"><a class="button button-secondary" href="#donors">Cancel</a><button class="button" type="submit">' +
            (isEdit ? "Save changes" : "Add donor") + "</button></div></form></section>";
    }

    function inventoryPage() {
        const rows = state.inventory.map(function (item) {
            return "<tr><td><span class=\"blood-type\">" + escapeHtml(item.group) + "</span></td><td><strong>" +
                escapeHtml(item.units) + "</strong></td><td>" + escapeHtml(item.updated) + "</td></tr>";
        });
        return pageTitle("Blood inventory", "Add incoming units and keep track of available stock.") +
            '<section class="panel form-panel"><div class="section-heading"><div><h2>Add blood stock</h2><p>Record newly collected or received units.</p></div></div>' +
            '<form class="inline-form" data-form="stock-add"><label>Blood group<select name="bloodGroup">' + bloodGroupOptions("A+") +
            '</select></label><label>Units<input name="units" type="number" min="1" max="10000" required></label>' +
            '<button class="button" type="submit">Add stock</button></form></section>' +
            '<section class="panel"><div class="section-heading"><div><h2>Current stock</h2><p>Stock is reduced when blood is issued.</p></div></div>' +
            table(["Blood group", "Units available", "Last updated"], rows, "No inventory records yet.") + "</section>";
    }

    function requestForm() {
        return pageTitle("Submit a blood request", "Create a request for a patient or hospital.") +
            '<section class="panel form-panel"><form data-form="request-create"><div class="form-grid">' +
            '<label>Patient name<input name="patient" type="text" maxlength="100" required></label>' +
            '<label>Hospital name<input name="hospital" type="text" maxlength="120" required></label>' +
            '<label>Blood group<select name="bloodGroup" required>' + bloodGroupOptions("A+") + '</select></label>' +
            '<label>Units required<input name="units" type="number" min="1" max="10000" required></label>' +
            '</div><div class="form-actions"><a class="button button-secondary" href="#requests">Cancel</a><button class="button" type="submit">Submit request</button></div></form></section>';
    }

    function requestList() {
        const rows = state.requests.map(function (request) {
            const actions = request.status === "Pending"
                ? '<button class="link-button" type="button" data-action="request-status" data-id="' + escapeHtml(request.id) + '" data-status="Approved">Approve</button>' +
                    '<button class="link-button danger-text" type="button" data-action="request-status" data-id="' + escapeHtml(request.id) + '" data-status="Rejected">Reject</button>'
                : '<span class="muted">—</span>';
            return "<tr><td>" + escapeHtml(request.id) + "</td><td><strong>" + escapeHtml(request.patient) +
                "</strong></td><td>" + escapeHtml(request.hospital) + "</td><td><span class=\"blood-type\">" +
                escapeHtml(request.bloodGroup) + "</span></td><td>" + escapeHtml(request.units) + "</td><td>" +
                escapeHtml(request.date) + '</td><td><span class="status status-' + escapeHtml(request.status.toLowerCase()) +
                '">' + escapeHtml(request.status) + "</span></td><td class=\"actions\">" + actions + "</td></tr>";
        });
        return pageTitle("Blood requests", "Review incoming requests and approve or reject pending items.",
                '<a class="button" href="#request-new">New request</a>') +
            '<section class="panel">' + table(["ID", "Patient", "Hospital", "Blood group", "Units", "Date", "Status", "Action"], rows, "No blood requests have been submitted.") + "</section>";
    }

    function issueForm() {
        const eligible = state.requests.filter(function (request) {
            return request.status === "Approved" && remainingFor(request, state) > 0;
        });
        const options = eligible.map(function (request) {
            const stock = getInventory(request.bloodGroup, state);
            const units = Math.min(remainingFor(request, state), stock ? Number(stock.units) : 0);
            return '<option value="' + escapeHtml(request.id) + '">' + escapeHtml(request.patient) + " · " +
                escapeHtml(request.bloodGroup) + " · Request #" + escapeHtml(request.id) + " · Up to " + units + " unit(s)</option>";
        }).join("");
        const hasAvailable = eligible.some(function (request) {
            const stock = getInventory(request.bloodGroup, state);
            return stock && Number(stock.units) > 0;
        });
        return pageTitle("Issue blood", "Issue available stock against an approved request.") +
            '<section class="panel form-panel"><form data-form="issue-create"><div class="form-grid">' +
            '<label class="form-span">Approved request<select name="requestId" required ' + (hasAvailable ? "" : "disabled") + ">" +
            (hasAvailable ? options : '<option value="">No approved requests with stock are available</option>') + '</select></label>' +
            '<label>Units to issue<input name="units" type="number" min="1" max="10000" required ' + (hasAvailable ? "" : "disabled") + '></label>' +
            '</div><p class="form-hint">The amount cannot exceed the remaining request or available blood stock.</p>' +
            '<div class="form-actions"><button class="button" type="submit" ' + (hasAvailable ? "" : "disabled") + '>Issue blood</button></div></form></section>' +
            '<section class="panel"><div class="section-heading"><div><h2>Approved requests</h2><p>Only approved requests with remaining units can receive an issue.</p></div></div>' +
            table(["Request", "Patient", "Blood group", "Remaining units", "Available stock"], eligible.map(function (request) {
                const stock = getInventory(request.bloodGroup, state);
                return "<tr><td>#" + escapeHtml(request.id) + "</td><td>" + escapeHtml(request.patient) +
                    "</td><td><span class=\"blood-type\">" + escapeHtml(request.bloodGroup) + "</span></td><td>" +
                    escapeHtml(remainingFor(request, state)) + "</td><td>" + escapeHtml(stock ? stock.units : 0) + "</td></tr>";
            }), "No approved requests are waiting for blood.") + "</section>";
    }

    function issueHistory() {
        const rows = state.issues.slice().sort(function (a, b) { return b.id - a.id; }).map(function (issue) {
            const request = state.requests.find(function (item) { return Number(item.id) === Number(issue.requestId); });
            return "<tr><td>" + escapeHtml(issue.id) + "</td><td>#" + escapeHtml(issue.requestId) +
                "</td><td>" + escapeHtml(request ? request.patient : "Unknown request") + "</td><td>" +
                escapeHtml(request ? request.bloodGroup : "—") + "</td><td>" + escapeHtml(issue.units) +
                "</td><td>" + escapeHtml(issue.date) + "</td></tr>";
        });
        return pageTitle("Blood issue history", "A record of blood issued against approved requests.",
                '<a class="button" href="#issues">Issue blood</a>') +
            '<section class="panel">' + table(["Issue ID", "Request ID", "Patient", "Blood group", "Units issued", "Issue date"], rows, "No blood has been issued yet.") + "</section>";
    }

    function render() {
        const route = (window.location.hash || "#dashboard").slice(1).split("/");
        const view = route[0];
        const id = route[1];
        const donor = view === "donor-edit"
            ? state.donors.find(function (item) { return String(item.id) === String(id); })
            : null;
        const views = {
            dashboard: dashboard,
            donors: donorList,
            "donor-new": function () { return donorForm(null); },
            "donor-edit": function () { return donor ? donorForm(donor) : pageTitle("Donor not found", "This donor record may have been removed.") + '<a class="button" href="#donors">Back to donors</a>'; },
            inventory: inventoryPage,
            requests: requestList,
            "request-new": requestForm,
            issues: issueForm,
            "issue-history": issueHistory
        };
        app.innerHTML = views[view] ? views[view]() : pageTitle("Page not found", "Choose a section from the navigation.") +
            '<a class="button" href="#dashboard">Go to dashboard</a>';
        document.querySelectorAll(".main-nav a").forEach(function (link) {
            const active = link.hash.slice(1) === view ||
                (view.indexOf("donor-") === 0 && link.hash === "#donors") ||
                (view === "issue-history" && link.hash === "#issue-history");
            link.classList.toggle("active", active);
        });
    }

    function field(formData, name) {
        return String(formData.get(name) || "").trim();
    }

    function handleSubmit(event) {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.dataset.form) return;
        event.preventDefault();
        const data = new FormData(form);

        if (form.dataset.form === "donor-create" || form.dataset.form === "donor-update") {
            const donor = {
                name: field(data, "name"),
                age: Number(field(data, "age")),
                gender: field(data, "gender"),
                bloodGroup: field(data, "bloodGroup"),
                phone: field(data, "phone"),
                email: field(data, "email"),
                address: field(data, "address")
            };
            if (!donor.name || !Number.isInteger(donor.age) || donor.age < 1 || donor.age > 120 ||
                !BLOOD_GROUPS.includes(donor.bloodGroup) || !donor.phone) {
                showToast("Enter a valid name, age, blood group, and phone number.", true);
                return;
            }
            if (form.dataset.form === "donor-create") {
                commit(function (next) {
                    donor.id = nextId(next.donors);
                    next.donors.unshift(donor);
                }, "Donor added.");
                window.location.hash = "#donors";
            } else {
                const donorId = Number(form.dataset.id);
                commit(function (next) {
                    const existing = next.donors.find(function (item) { return Number(item.id) === donorId; });
                    if (!existing) throw new Error("This donor could not be found.");
                    Object.assign(existing, donor);
                }, "Donor updated.");
                window.location.hash = "#donors";
            }
            return;
        }

        if (form.dataset.form === "stock-add") {
            const group = field(data, "bloodGroup");
            const units = Number(field(data, "units"));
            if (!BLOOD_GROUPS.includes(group) || !Number.isInteger(units) || units < 1) {
                showToast("Choose a blood group and enter a positive number of units.", true);
                return;
            }
            commit(function (next) {
                const item = getInventory(group, next);
                if (!item) throw new Error("Inventory group not found.");
                item.units = Number(item.units) + units;
                item.updated = today();
            }, "Blood stock added.");
            return;
        }

        if (form.dataset.form === "request-create") {
            const request = {
                patient: field(data, "patient"),
                hospital: field(data, "hospital"),
                bloodGroup: field(data, "bloodGroup"),
                units: Number(field(data, "units")),
                date: today(),
                status: "Pending"
            };
            if (!request.patient || !request.hospital || !BLOOD_GROUPS.includes(request.bloodGroup) ||
                !Number.isInteger(request.units) || request.units < 1) {
                showToast("Enter the patient, hospital, blood group, and a positive unit count.", true);
                return;
            }
            commit(function (next) {
                request.id = nextId(next.requests);
                next.requests.unshift(request);
            }, "Blood request submitted.");
            window.location.hash = "#requests";
            return;
        }

        if (form.dataset.form === "issue-create") {
            const requestId = Number(field(data, "requestId"));
            const units = Number(field(data, "units"));
            commit(function (next) {
                const request = next.requests.find(function (item) { return Number(item.id) === requestId; });
                if (!request || request.status !== "Approved") throw new Error("Only approved requests can be issued.");
                if (!Number.isInteger(units) || units < 1 || units > remainingFor(request, next)) {
                    throw new Error("Enter a valid quantity within the request's remaining units.");
                }
                const stock = getInventory(request.bloodGroup, next);
                if (!stock || Number(stock.units) < units) throw new Error("There is not enough blood stock available.");
                stock.units = Number(stock.units) - units;
                stock.updated = today();
                next.issues.unshift({
                    id: nextId(next.issues),
                    requestId: request.id,
                    units: units,
                    date: today()
                });
            }, "Blood issued and inventory updated.");
            return;
        }
    }

    function handleClick(event) {
        const button = event.target.closest("[data-action]");
        if (!button) return;

        if (button.dataset.action === "delete-donor") {
            if (!window.confirm("Delete this donor record?")) return;
            const id = Number(button.dataset.id);
            commit(function (next) {
                next.donors = next.donors.filter(function (donor) { return Number(donor.id) !== id; });
            }, "Donor deleted.");
            return;
        }

        if (button.dataset.action === "request-status") {
            const id = Number(button.dataset.id);
            const status = button.dataset.status;
            commit(function (next) {
                const request = next.requests.find(function (item) { return Number(item.id) === id; });
                if (!request || request.status !== "Pending" || !["Approved", "Rejected"].includes(status)) {
                    throw new Error("This request can no longer be updated.");
                }
                request.status = status;
            }, "Request " + status.toLowerCase() + ".");
            return;
        }

        if (button.dataset.action === "reset-demo") {
            if (!window.confirm("Reset all data in this browser to the original sample records?")) return;
            try {
                const initial = createSeedData();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
                state = initial;
                window.location.hash = "#dashboard";
                render();
                showToast("Demo data reset.");
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Could not reset demo data.", true);
            }
        }
    }

    try {
        state = loadState();
        document.addEventListener("submit", handleSubmit);
        document.addEventListener("click", handleClick);
        window.addEventListener("hashchange", render);
        render();
    } catch (error) {
        app.innerHTML = '<section class="panel error-panel"><h1>Unable to load the demo</h1><p>' +
            escapeHtml(error instanceof Error ? error.message : "Browser storage is unavailable.") +
            '</p><p>Please enable browser storage and reload this page.</p></section>';
    }
}());
