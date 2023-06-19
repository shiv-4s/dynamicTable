import { LightningElement, track, wire } from 'lwc';
import fetchSObjectRecord from '@salesforce/apex/DynamicTableController.fetchSObjectRecord';
import fetchSObjectFieldName from '@salesforce/apex/DynamicTableController.fetchSObjectFieldName';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class DynamicTable extends NavigationMixin(LightningElement) {

    fetchedData;
    errorMessage;
    fieldList;
    recordId;
    fullData= [];
    fieldName;
    nameRec;

    @wire(fetchSObjectFieldName)
    airedField({data, erorr}){
        if(data){
            this.fieldName = data;
        }
        else if(erorr){
            console.log("+++++++error++++++++ "  + erorr.body.message);
        }
    }

    //wire funtion to fetch the record from apex method fetchSObjectRecord
    @wire(fetchSObjectRecord)
    wiredSObject({data, error}){ 
        if(data){
            this.fetchedData = JSON.parse(JSON.stringify(data));
            this.fetchedData.forEach(element => {
                var rec =[];
                this.fieldName.forEach(list => {
                    if(!(Object.hasOwn(element,list))){
                        let obj = new Object();
                        obj[list] = '';
                        Object.assign(element,obj);
                    }
                    rec.push(element[list]);
                })
                this.fullData.push(rec);
            });
            console.log("++++++++fetchedData+++++++ " + JSON.stringify(this.fetchedData));
            console.log('++++++++fulldata++++++++ ',this.fullData);
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