import { LightningElement, wire } from 'lwc';
import getProductInfo from '@salesforce/apex/ProductController.getProductInfo';
import getPickListValuesIntoList from '@salesforce/apex/PickListController.getPickListValuesIntoList';
import { NavigationMixin } from 'lightning/navigation';

export default class DisplayProduct extends NavigationMixin(LightningElement) {

    productRecord;
    error;
    productId;
    pickListValue = [];
    options;
    productName;
    showValue;
    categoryProduct=[];

    /**
     * 
     * @ wiredProduct fetch the record from apex 
     */
    @wire(getProductInfo)
    wiredProduct({data, error}){
        if(data){
            console.log("+++++data++++++ "  + JSON.stringify(data));
            this.productRecord = JSON.parse(JSON.stringify(data));
            this.error = undefined;
        }
        else if(error){
            this.productRecord = undefined;
            this.error = error;
        }
    }

    /**
     * 
     * @param {objectType, selectedField} getPickListValuesIntoList fetch the picklist value for giving objectName and picklist fieldName 
     */

    @wire(getPickListValuesIntoList, {objectType : 'Product__c', selectedField : 'Category__c'})
    wiredCountry({data, error}){
        if(data){
            this.pickListValue = JSON.parse(JSON.stringify(data));
            console.log("+++pickListValue++++++", this.pickListValue);
        }
        else if(error){
            this.error = error;
            console.log("+++++++error++++++ " + JSON.stringify(error));
        }
    }

    /**
     * 
     * goToRecordPage method for navigating to that particular record
     */

    goToRecordPage(event){
        this.productId = event.target.dataset.id;
        console.log("++++++++productId+++++++ " + this.productId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productId,
                actionName: 'view',
            },
        })
    }

    handleProduct(event){
        this.productName = event.target.value;
        this.showValue = true;
        this.result = this.pickListValue.filter((picklistOption) =>
        picklistOption.includes(this.productName));
    }

    selectSearchProduct(event){
        this.template.querySelector('.selectcountry').value = event.target.value;
        this.showValue = false;
        console.log("+++++selectedValue+++++++ " , event.target.value);
        this.categoryProduct = [];
        this.productRecord.forEach(element => {
            if(element.Category__c === event.target.value){
                this.categoryProduct.push(element);
            }
            });
        console.log("++++++categoryProduct+++++++ " , this.categoryProduct);
    }

}