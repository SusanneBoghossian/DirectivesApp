angular.module("DirectiveApp", [])
    .service("contactService", function ($http) {
    var contactArray = null;
    this.getContacts = function (callback) {
        if (!contactArray) {
            $http.get("contacts.json")
                .then(function (res) {
                contactArray = res.data;
                callback(contactArray);
            });
        }
        else {
            callback(contactArray);
        }
    };
    this.submitChanges = function (contact, callback) {
        if (!!contact) {
            if (contact.id == '') {
                var largestId = contactArray
                    .map(function (contact) { return +contact.id; })
                    .reduce(function (largestId, currentId) { return currentId > largestId ? currentId : largestId; }, 0);
                contact.id = "" + (largestId + 1);
                contactArray.push(contact);
            }
            else {
                contactArray = contactArray
                    .map(function (contactFromArray) {
                    return (contactFromArray.id != contact.id) ? contactFromArray : contact;
                });
            }
            callback();
        }
    };
    this.deleteContact = function (id, callback) {
        if (!!contactArray) {
            contactArray = contactArray.filter(function (x) { return x.id != id; });
        }
        callback();
    };
})
    .directive("mainApp", ['contactService', function (contactService) {
        return {
            restrict: "E",
            templateUrl: "mainapp.html",
            controller: function () {
                function createEmptyContact() {
                    return { id: '', name: '', age: '' };
                }
                this.contactList = null;
                this.currentContact = createEmptyContact();
                var that = this;
                this.deleteContact = function (id) {
                    contactService.deleteContact(id, function () {
                        that.getContacts();
                    });
                };
                this.editContact = function (contact) {
                    // this.currentContact = contact;
                    that.currentContact = {
                        id: contact.id,
                        name: contact.name,
                        age: contact.age
                    };
                };
                this.submitChanges = function (contact) {
                    contactService.submitChanges(contact, function () {
                        that.currentContact = createEmptyContact();
                        that.getContacts();
                    });
                };
                this.getContacts = function () {
                    contactService.getContacts(function (list) {
                        that.contactList = list;
                    });
                };
                this.getContacts();
            },
            controllerAs: 'ctrl'
        };
    }])
    .directive("mainList", function () {
    return {
        restrict: "E",
        templateUrl: "mainlist.html",
        scope: {
            contactList: "=",
            edit: "&",
            delete: "&"
        }
    };
})
    .directive("contactRow", function () {
    return {
        restrict: "A",
        templateUrl: "rows.html",
        scope: {
            contact: "=",
            delete: "&",
            edit: "&"
        }
    };
})
    .directive("customizeContact", function () {
    return {
        restrict: "E",
        templateUrl: "customizer.html",
        scope: {
            contact: "=",
            submitChanges: "&"
        }
    };
});
