import { LightningElement, track, wire } from 'lwc';
import fetchSObjectRecord from '@salesforce/apex/DynamicTableController.fetchSObjectRecord';
// import fetchSObjectFieldName from '@salesforce/apex/DynamicTableController.fetchSObjectFieldName';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class DynamicTable extends NavigationMixin(LightningElement) {

  
    
    fetchedData;
    errorMessage;
    fieldList;
    recordId;
    fieldName;

    //wire funtion to fetch the record from apex method fetchSObjectRecord
    @wire(fetchSObjectRecord)
    wiredSObject({data, error}){ 
        if(data){
           let setField = new Set();
            this.fetchedData = data;
            this.fetchedData.forEach(element => {
                this.fieldName = Object.keys(element);
            });
            console.log("++++++++fetchedData+++++++ " + JSON.stringify(this.fetchedData));
            console.log("++++++++fieldName+++++++ " + JSON.stringify(this.fieldName));

        }
        else if(error){
            console.log("+++++++error++++++++ "  + error.body.message);
            this.errorMessage = error.body.message;
                const event = new ShowToastEvent({
                    title: 'Unable To Load Record',
                    message: this.errorMessage,
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
        }
    }
    

    //method to navigate on a particular record in table
    goToRecordPage(event){
        this.recordId = event.target.dataset.id;
        console.log("+++++++ " +  this.recordId);
          // Generate a URL to a User record page
          this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
              recordId: this.recordId,
              actionName: 'view'
            }
        });
    }

}