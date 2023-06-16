import { LightningElement, wire } from 'lwc';
import fetchSObjectRecord from '@salesforce/apex/DynamicTableController.fetchSObjectRecord';
import fetchSObjectFieldName from '@salesforce/apex/DynamicTableController.fetchSObjectFieldName';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DynamicTable extends LightningElement {

    fetchedData;
    errorMessage;
    fieldList;

    @wire(fetchSObjectRecord)
    wiredSObject({data, error}){ 
        if(data){
            this.fetchedData = data;                
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

    @wire(fetchSObjectFieldName)
    wiredField({data, error}){
        if(data){
            this.fieldList = data;
            console.log("+++++++++fieldNameData+++++ " + JSON.stringify(data));
 
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

}