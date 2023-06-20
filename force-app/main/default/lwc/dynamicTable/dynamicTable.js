import { LightningElement, wire } from 'lwc';
import fetchSObjectRecord from '@salesforce/apex/DynamicTableController.fetchSObjectRecord';
import fetchSObjectFieldName from '@salesforce/apex/DynamicTableController.fetchSObjectFieldName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';



export default class DynamicTable extends LightningElement {

    errorMessage;
    recordId;
    columns=[]
    saveDraftValues = [];
    objName;
    fieldValues;
    data;

    @wire(fetchSObjectFieldName)
    wiredField({data, erorr}){
        if(data){
            console.log("+++++++data+++++++++ " + JSON.stringify(data));
            data.forEach(element => {
                this.objName = element.Object_Type__c;
                console.log("+++++objName+++++ " + this.objName);
                this.fieldValues = element.Query__c;
                console.log("+++++fieldValues+++++ " + this.fieldValues);
                let fldName;
                fldName = this.fieldValues.split(',');
                fldName.forEach(element => {
                    if(element === "Name"){
                        let elementValue = {label: element, fieldName: 'recordNameUrl', type: 'url', typeAttributes: {label: {fieldName : 'Name'}, target: '_self'}};
                        this.columns = [...this.columns, elementValue];
                    }
                    else{
                        let elementValue1 = {label: element, fieldName: element, editable: true};
                        this.columns = [...this.columns, elementValue1];
                    }
                });

            });
        }
        else if(erorr){
            console.log("+++++++error++++++++ "  + erorr.body.message);
        }
    }

    @wire(fetchSObjectRecord, {objectName: '$objName', fields: '$fieldValues'})
    wiredRecord(result) {
        if (result.data) {
            let orignalData = [];
            result.data.forEach((ele) => {
                // console.log('name>>>', ele.Name);
                let tempData = Object.assign({}, ele);
                tempData.recordNameUrl = '/' + tempData.Id;
                orignalData.push(tempData);
            })
            this.data = orignalData;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    handleSave(event){
        this.saveDraftValues = event.detail.draftValues;
        //console.log('________saveDraftValues__________', JSON.stringify(this.saveDraftValues));
        const inputsItems = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            //console.log('__________fields____________', JSON.stringify(fields));
            return { fields };
        });

        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        //console.log('________________promises____________________', JSON.stringify(promises));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            return refreshApex(this.mainresult);
        }).catch(error => {
            //console.log('______error________',JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }
}