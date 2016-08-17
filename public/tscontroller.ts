declare var angular: any;

interface Contact {
    id: string;
    name: string;
    age: string;
}

angular.module("DirectiveApp", [])

    //-------------SERVICE-----------------------
    .service("contactService", function ($http) {
        var contactArray: Contact[] = null;

        this.getContacts = function (callback) {
            if (!contactArray) {
                $http.get("contacts.json")
                    .then(function (res) {
                        contactArray = res.data;
                        callback(contactArray);
                    });
            } else {
                callback(contactArray);
            }
        }
        this.submitChanges = function (contact: Contact, callback) {
            if (!!contact) {
                if (contact.id == '') {
                    var largestId = contactArray
                        .map(contact => +contact.id)
                        .reduce((largestId, currentId) => currentId > largestId ? currentId : largestId, 0);

                    contact.id = `${largestId + 1}`
                    contactArray.push(contact);
                } else {
                    contactArray = contactArray
                        .map(function(contactFromArray) {
                            return (contactFromArray.id != contact.id) ? contactFromArray : contact;
                        });
                }
                callback();
            }
        }
        this.deleteContact = function (id, callback) {
            if (!!contactArray) {
                contactArray = contactArray.filter(function (x) { return x.id != id; })
            }
            callback();
        }

    })
    //---------DIRECTIVES-------------------  
    .directive("mainApp", ['contactService', function (contactService) {
        return {
            restrict: "E",
            templateUrl: "mainapp.html",
            controller: function () {
                
                function createEmptyContact(): Contact {
                    return { id: '', name: '', age: '' };
                }
                this.contactList = null;
                this.currentContact = createEmptyContact();

                var that = this;
                this.deleteContact = function (id) {
                    contactService.deleteContact(id, function () {
                        that.getContacts();
                    });
                }
                this.editContact = function (contact) {
                    // this.currentContact = contact;
                    that.currentContact = {
                        id: contact.id,
                        name: contact.name,
                        age: contact.age
                    };
                }
                this.submitChanges = function (contact) {
                    contactService.submitChanges(contact, function () {
                        that.currentContact = createEmptyContact();
                        that.getContacts();
                    })
                }
                this.getContacts = function () {
                    contactService.getContacts(function (list) {
                        that.contactList = list;
                    });
                }
                this.getContacts();
            },
            controllerAs: 'ctrl'
        }
    }])
    .directive("mainList", function () {
        return {
            restrict: "E",
            templateUrl: "mainlist.html",
            // controller: function() {
            //     this.deleteContact = function(id) {
            //         // console.log(this.delete)
            //         this.delete(id);
            //         console.log('we are here', id)
            //     }
            // },
            // controllerAs: 'ctrl',
            scope: {
                contactList: "=",
                edit: "&",
                delete: "&"
            },
            // bindToController:{
            //     contactList: "=",
            //     edit: "&",
            //     delete: "&"
            // }
        }
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
        }
    })

    .directive("customizeContact", function () {
        return {
            restrict: "E",
            templateUrl: "customizer.html",
            scope: {
                contact: "=",
                submitChanges: "&"
            }
        }
    })

    //old ones      
    // .directive("mainApp", function () {
    //     return {
    //         restrict: "E",
    //         template: "<input type='text' ng-model='ctrl.nameInMain'/>{{ctrl.nameInMain}}<text name-in-text='ctrl.nameInMain' clear='ctrl.clear666()'></text>",
    //         controller: function () {
    //             this.nameInMain = 'foobar';
    //             this.clear666 = function () {
    //                 this.nameInMain = '';
    //             }
    //         },
    //         controllerAs: 'ctrl',
    //     }
    // })
    // .directive("text", function () {
    //     return {
    //         restrict: "E",
    //         scope: {

    //             nameInText: '=',
    //             clear: '&'
    //         },         
    //         template: "<h1>Hello <i>{{nameInText}}</i></h1><button ng-click='clear()'>clear</button>"
    //     }
    // })