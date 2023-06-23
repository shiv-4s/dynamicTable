@RestResource(urlMapping='/ContactAPI/*')
global class ContactResource {

    @HttpGet
    global static List<Contact> getContactIdAndNames(){
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        String contactRequestURI = request.requestURI;
        System.debug('contactRequestURI++++ ' + contactRequestURI);
        Integer contactLimit = Integer.valueOf(contactRequestURI.substring(contactRequestURI.lastIndexOf('/')+ 1));
        List<Contact> result =  [SELECT Id,Name FROM Contact LIMIT : contactLimit];
        return result;
    }

    @HttpPost
    global static Contact createNewContact(String firstName, String lastName, String birthDate, String leadSource){
        Contact newContact = new Contact();
        newContact.FirstName = firstName;
        newContact.LastName = lastName;
        newContact.Birthdate = Date.parse(birthDate);
        newContact.LeadSource = leadSource;
        INSERT newContact;
        return newContact;
    }

    @HttpDelete
    global static Map<String, String> deleteContact(){
        Map<String, String> mapResponse = new Map<String, String>();
        RestRequest request = RestContext.request;
        String contactRequestURI = request.requestURI;
        Id deleteId = Id.valueOf(contactRequestURI.substring(contactRequestURI.lastIndexOf('/') + 1));
        Contact contact = new Contact(Id=deleteId);
        try{
            DELETE contact;
            mapResponse.put('success', '1');
            mapResponse.put('message', 'Record Deleted Successfully');
            return mapResponse;
        }
        catch(DMLException ex){
            mapResponse.put('success', '0');
            mapResponse.put('message', ex.getMessage());
        }
        return mapResponse;
    }

    @HttpPut
    global static Contact upsertContact(String firstName, String lastName, String birthDate, String leadSource){
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        String contactRequestURI = request.requestURI;
        String contactId = contactRequestURI.substring(contactRequestURI.lastIndexOf('/') + 1);
        Contact newContact = new Contact();
        if(String.isNotEmpty(contactId)){
            newContact.Id = contactId;
        }
        newContact.FirstName = firstName;
        newContact.LastName = lastName;
        newContact.Birthdate = Date.parse(birthDate);
        newContact.LeadSource = leadSource;
        UPSERT newContact;
        return newContact;
    }

    @HttpPatch
    global static Contact updateContact(){
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        String contactRequestURI = request.requestURI;
        String contactId = contactRequestURI.substring(contactRequestURI.lastIndexOf('/') + 1);
        String contactRequestBody = request.requestBody.toString();
        Contact newContact;
        if(String.isNotEmpty(contactId)){
            newContact = (Contact)JSON.deserialize(contactRequestBody, Contact.class);
            newContact.Id = contactId;
            UPDATE newContact;
        }
        return newContact;
    }
}