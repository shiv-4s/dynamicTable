import { LightningElement, track, wire } from 'lwc';
import getProductInfo from '@salesforce/apex/ProductController.getProductInfo';
import getPickListValuesIntoList from '@salesforce/apex/PickListController.getPickListValuesIntoList';
import { NavigationMixin } from 'lightning/navigation';

export default class DisplayProduct extends NavigationMixin(LightningElement) {

    productRecord;
    error;
    productId;
    options = []; 
    categoryProduct=[];
    filterProduct=[];
    currentPage = 1;
    totalPage = 0;
    recordSize = 5;
    selectedItem;
    @track visibleRecords=[];

    /**
     * 
     * @ wiredProduct fetch the record from apex 
     */
    @wire(getProductInfo)
    wiredProduct({data, error}){
        if(data){
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
            this.options = data.map(item=>{
                return {
                    label: item,
                    value: item
                }
            })
            console.log("+++++options+++++ " + JSON.stringify(this.options));
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
        this.selectedItem = event.target.value;
        console.log("+++++selectedValue+++++++ " , event.target.value);
        this.previousRecordCount = 5;
        this.categoryProduct = [];
        this.productRecord.forEach(element => {
            if(element.Category__c === event.target.value){
                this.categoryProduct.push(element);
            }
            });
        //this.filterProduct = this.categoryProduct.slice(0, this.previousRecordCount);
        this.currentPage =1;
        this.recordSize = Number(this.recordSize);
        this.totalPage = Math.ceil(this.categoryProduct.length/this.recordSize);
        console.log("++++++recordSize+++++++ " , this.recordSize);
        console.log("++++++totalPage+++++++ " , this.totalPage);
        this.updateRecords()
       

    }

    previousHandler(){
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1
            this.updateRecords()
        }
    }
    nextHandler(){
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage+1;
            this.updateRecords();
        }
    }
    updateRecords(){
        const start = (this.currentPage-1)*this.recordSize
        const end = this.recordSize*this.currentPage
        console.log('===start==', start);
        console.log('==end==', end);
        this.visibleRecords = this.categoryProduct.slice(start, end);
        console.log('this.visibleRecords=====', JSON.stringify(this.visibleRecords));
    }

    get disablePrevious(){
        return this.currentPage<=1
    }
    get disableNext(){
        return this.currentPage>=this.totalPage
    }

}