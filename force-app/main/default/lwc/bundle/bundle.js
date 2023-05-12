import { LightningElement,api, track, wire } from 'lwc';
import getBundle from '@salesforce/apex/BundleClass.getBundle';
import getQuestionsFromBundles from '@salesforce/apex/DataService.getQuestionsFromBundles';

export default class Bundle extends LightningElement {

    displayedBundleList;
    Existingbundle=true;
    @track selectedItems = [];
    @track laylistName;
    @track playlistId;

    @wire(getBundle)
    wiredBundles({ error, data }) {
      if (data) {
          this.bundleList = data;
          this.displayedBundleList = data;
      } else if (error) {
          console.error(error);
      }
    }
    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        this.displayedBundleList = this.bundleList.filter(
            bundle => bundle.Name.toLowerCase().includes(query)
        );
    }

    @wire(getQuestionsFromBundles,{BundleId : '$playlistId'}) 
    BundleQuestions({data, error}) {
      if(data) {
         this.questionsIds = data;
         this.questionsIds = this.questionsIds.map(obj => {
            return {
                  Id : obj.Id,
                  Name : obj.Name,
                  Selected : false ,
                  Answer : obj.Answer__c,
                  SelectedAnswer :false,
                  Mark : 0,
                  Comment : null
            };
         });
         this.selectedItems = this.questionsIds;
       }
      else if(error)
      {
         console.log(error);
      }
   }
   handleBundleQuestionsVisibility(event){
        this.Existingbundle = false;
        this.playlistId = event.target.closest('.ag-item').dataset.playlistid; 
        this.playlistName = event.target.closest('.ag-item').dataset.playlistname;
        this.selectedItems.splice(0, this.selectedItems.length);

   }
   handleBackchoosebundle(event){
      this.Existingbundle = true;
      this.displayedBundleList = this.bundleList;
    }
   



}