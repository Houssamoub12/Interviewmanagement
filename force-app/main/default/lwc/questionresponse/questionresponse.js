import { LightningElement,wire ,track} from 'lwc';
import getPannes from '@salesforce/apex/PanneClass.getPannes';
import noHeader from '@salesforce/resourceUrl/NoHeader';
import {loadStyle} from "lightning/platformResourceLoader";
import {MessageContext} from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import createQuestionsResponses from '@salesforce/apex/DataServicePush.createQuestionsResponses';
import changeEvaluationStatus from '@salesforce/apex/DataServicePush.changeEvaluationStatus';
import createBundle from '@salesforce/apex/DataServicePush.createBundle';
import QUESTION_API_NAME from '@salesforce/schema/Question__c';
import SECTION_FIELD from '@salesforce/schema/Question__c.Section__c';
import SUBSECTION_FIELD from '@salesforce/schema/Question__c.Subsection__c';
import getQuestionsBasedOnTheirSubsection from '@salesforce/apex/DataService.getQuestionsBasedOnTheirSubsection';
import getQuestionsBasedOnTheirSection from '@salesforce/apex/DataService.getQuestionsBasedOnTheirSection';
import my_Resource from '@salesforce/resourceUrl/myResource';
import Nofound from '@salesforce/resourceUrl/Nofound';
import background_image from '@salesforce/resourceUrl/backgroundimage';


export default class questionresponse extends LightningElement {
    notFoundImage = Nofound;
    myImage = my_Resource;
    imageback = background_image;
    filterchoice = true;
    avaiblechoice = true;
    Existingbundle = false;
    thereis = true;
    @wire(MessageContext)
    messageContext;
    Cards;
    panel;
    targetJob;
    interviewLeadId;
    interviewerName;
    interviewerId;
    interviewerTitle;
    interviewDate;
    interviewLead;
    @track bare;
    Evaluations = true
    bundleList;
    displayedBundleList;
    pannes = [];
    error;
    jobs;
    click = 0;
    clickquestion = 0;
    items = false;
    selectedIndex;
    @track selectedItems = [];
    sectionValues;
    selectedLevels = new Set();
    selectedLevelsSection = new Set();
    selectedTypes = [];
    selectedTypesSection = []
    sectionVisibility = true;
    technical = false;
    cards = true;
    bundleVisibility = false;
    plusDetail = false;
    selectedSection;
    section;
    questions;
    @track finalQuestions;
    @track finalQuestionsSection;
    questionMetaData;
    rows;
    ActualCard;
    sectionquestion;
    @track isEmpty=true;
    @track isEmptysection=true
    quest;
    @track showreponse = false;
    Answer;
    questionId;
    questionToDelete;
    comments=[];
    currentEvaluation;
    @track isModalOpen = false;
    bundleName;
    bundleDesc;
    playlistName;
    playlistId;
   questionsIds;


    get questions() {    
        return this.questions;
    }
    get sectionquestion() {    
        return this.sectionquestion;
    }
    get rows() {    
        return this.rows;
    }
    get sectionVisibility() {
        return this.sectionVisibility;
    }
    get options() {
      return [
          { label: 'All', value: 'All' },
          { label: 'Single response', value: 'Single response' },
          { label: 'Multiple response', value: 'Multiple response' },

      ];
  }
    barInfos  = { Name :'hamza' , job : 'dev' , company:'oreivaton'};
    formatDate(dateString) {
      const date = new Date(dateString); 
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    connectedCallback() {
        console.log("ouboooooli");

        loadStyle(this, noHeader)
            .then(result => {});
    }

    renderedCallback(){
        console.log(this.bare);
    }
    @wire(getPannes)
    func({ data, error }) {
        if (data) {
            this.pannes = data.map(panne => {
                    const formattedDate = this.formatDate(panne.Date__c);
                    let name = panne.Name
                    name = name.replace('.', ' ').replace('-', ' ').replace('_',' ');
                    name = name.toUpperCase();
                    return { ...panne, Date__c : ' '+formattedDate , Name : name};
            });
        } else if (error) {
            console.log(error);
        }
    }
    handleCardClick(event){
        this.Cards = true;
        this.Evaluations = false
        this.interviewLead = event.target.closest('.ag-courses-item_link').dataset.lead;
        this.interviewDate = event.target.closest('.ag-courses-item_link').dataset.date;
        this.interviewerName = event.target.closest('.ag-courses-item_link').dataset.interviewer;
        this.interviewerId = event.target.closest('.ag-courses-item_link').dataset.interviewerid;
        this.interviewerTitle = event.target.closest('.ag-courses-item_link').dataset.title;
        this.interviewLeadId = event.target.closest('.ag-courses-item_link').dataset.leadid;
        this.currentEvaluation = event.target.closest('.ag-courses-item_link').dataset.evaluationid;
        console.log(this.currentEvaluation);
    }
    @wire(getQuestionsBasedOnTheirSubsection,{subsection : '$selectedSection'}) 
    Questions({data, error}) {
       if(data) {
          this.questions = data;
          this.finalQuestions = this.questions
          console.log(JSON.parse(JSON.stringify(this.finalQuestions)));
          console.log(JSON.parse(JSON.stringify(this.finalQuestions.length)));
          this.error = null;
          if(this.finalQuestions.length==0){
            this.isEmpty = true;
          }else {
            this.isEmpty = false;
          }
       }
       else if(error)
       {
          console.log(error);
          this.questions = null;
          this.error = error;
          this.isEmpty = true;
       }
    } 
    @wire(getQuestionsBasedOnTheirSection,{section : '$section'}) 
    QuestionsRows({data, error}) {
       if(data) {
          this.sectionquestion = data;
          this.finalQuestionsSection = this.sectionquestion
          console.log(this.sectionquestion);
          this.error = null;
          if(this.finalQuestionsSection.length==0){
            this.isEmptysection = true;
          }else {
            this.isEmptysection = false;
          }
       }
       else if(error)
       {
          console.log(error);
          this.sectionquestion = null;
          this.error = error;
          this.isEmptysection = true;
       }
    }




   @wire(getObjectInfo, { objectApiName: QUESTION_API_NAME }) questionMetaData;
	@wire(getPicklistValues, { 
        recordTypeId: '$questionMetaData.data.defaultRecordTypeId', 
        fieldApiName: SECTION_FIELD
    }) sectionValues({data, error}) {
        if(data) {
            this.rows = data.values.map(obj => {
                return {firstletter : obj.value.charAt(0), value : obj.value};
             });
           console.log(this.rows);
           console.log(this.rows.firstletter);
           this.error = null;
        }
        else if(error)
        {
           console.log(error);
           this.rows = null;
           this.error = error;
        }
     }

     handleClick(evt){
         var sect = evt.target.closest('.card-content').dataset.section;
         this.sectionVisibility = false;
         console.log(this.sectionquestion);
         if(sect === 'Technical') {
             this.technical = true;
         }else{
            this.technical = false;

            this.section = sect;
            console.log(this.section);
         }
         
     }

     @wire(getPicklistValues, { 
        recordTypeId: '$questionMetaData.data.defaultRecordTypeId', 
        fieldApiName: SUBSECTION_FIELD
    }) subsectionValues({data, error}) {
        if(data) {
            this.rows2 = data.values.map(obj => {
                return {firstletter2 : obj.value.charAt(0), value : obj.value};
             });;
          
           this.error = null;
        }
        else if(error)
        {
           console.log(error);
           this.error = error;
        }
     }

     handleClick2(event){
        this.cards = false;
        var currentsection = event.target.closest('.card-content').dataset.key;
        console.log(currentsection);
        this.selectedSection = currentsection;        
     }

       
   handleLevelChange(event) {
      const selectedLevel = event.target.value;
      const checked = event.target.checked;
      if(checked){
         this.selectedLevels.add(selectedLevel);
         if(this.selectedTypes.length >= 1){
            this.finalQuestions = this.questions.filter(question =>this.selectedLevels.has(question.Level__c) && this.selectedTypes.includes(question.Type__c));
         }else{
            this.finalQuestions = this.questions.filter(question =>this.selectedLevels.has(question.Level__c));
         }     
      }else{
         this.selectedLevels.delete(selectedLevel);
         if(this.selectedTypes.length === 1){
            console.log(selectedTypes);
            if(this.selectedLevels.size === 0){
               this.finalQuestions = this.questions.filter(question =>this.selectedTypes.includes(question.Type__c));
            }else{
               this.finalQuestions = this.questions.filter(question =>this.selectedLevels.has(question.Level__c) && this.selectedTypes.includes(question.Type__c));
            }
         }else{
            if(this.selectedLevels.size === 0){
               this.finalQuestions = this.questions;
            }else{
               console.log(this.selectedLevels);
               this.finalQuestions = this.questions.filter(question =>this.selectedLevels.has(question.Level__c));
            }
         }
      }
      if(this.finalQuestions.length==0){
         this.isEmpty = true;
      }else {
         this.isEmpty = false;
      }
   }
   handleTypeChange(event){
      const selectedOption = event.target.value;
      if(this.selectedLevels.size >= 1){
         if(selectedOption === 'All'){
            this.finalQuestions = this.questions.filter(question =>this.selectedLevels.has(question.Level__c));
         }else{
            this.selectedTypes = [];
            this.selectedTypes.push(selectedOption);
            console.log(this.selectedTypes);
            this.finalQuestions = this.questions.filter(question =>this.selectedTypes.includes(question.Type__c) && this.selectedLevels.has(question.Level__c));
         }
      }else{
         if(selectedOption === 'All'){
            this.finalQuestions = this.questions;
         }else{
            this.selectedTypes = [];
            this.selectedTypes.push(selectedOption);
            console.log(this.selectedTypes);
            this.finalQuestions = this.questions.filter(question =>this.selectedTypes.includes(question.Type__c));
         }
      } 
      if(this.finalQuestions.length==0){
         this.isEmpty = true;
       }else {
         this.isEmpty = false;
       }  
   }


   handleLevelSectionChange(event) {
      const selectedLevel = event.target.value;
      const checked = event.target.checked;
      if(checked){
         this.selectedLevelsSection.add(selectedLevel);
         if(this.selectedTypesSection.length >= 1){
            this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedLevelsSection.has(question.Level__c) && this.selectedTypesSection.includes(question.Type__c));
         }else{
            this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedLevelsSection.has(question.Level__c));
         }     
      }else{
         this.selectedLevelsSection.delete(selectedLevel);
         if(this.selectedTypesSection.length === 1){
            if(this.selectedLevelsSection.size === 0){
               this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedTypesSection.includes(question.Type__c));
            }else{
               this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedLevelsSection.has(question.Level__c) && this.selectedTypesSection.includes(question.Type__c));
            }
         }else{
            if(this.selectedLevelsSection.size === 0){
               this.finalQuestionsSection = this.sectionquestion;
            }else{
               this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedLevelsSection.has(question.Level__c));
            }
         }
      }
      if(this.finalQuestionsSection.length==0){
         this.isEmptysection = true;
       }else {
         this.isEmptysection = false;
       }
    
   }

   handleTypeSectionChange(event){
      const selectedOption = event.target.value;
      if(this.selectedLevelsSection.size >= 1){
         if(selectedOption === 'All'){
            this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedLevelsSection.has(question.Level__c));
         }else{
            this.selectedTypesSection = [];
            this.selectedTypesSection.push(selectedOption);
            console.log(this.selectedTypes);
            this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedTypesSection.includes(question.Type__c) && this.selectedLevelsSection.has(question.Level__c));
         }
      }else{
         if(selectedOption === 'All'){
            this.finalQuestionsSection = this.sectionquestion;
         }else{
            this.selectedTypesSection = [];
            this.selectedTypesSection.push(selectedOption);
            this.finalQuestionsSection = this.sectionquestion.filter(question =>this.selectedTypesSection.includes(question.Type__c));
         }
      }   
      if(this.finalQuestionsSection.length==0){
         this.isEmptysection = true;
       }else {
         this.isEmptysection = false;
       }
   }

   handlebubble(event){
      
      this.selectedIndex = event.target.closest('.checkbox').dataset.id;
      this.Answer = event.target.closest('.checkbox').dataset.answer;
      this.questionId = event.target.closest('.checkbox').dataset.questionname;

      console.log('lid :',this.questionId);

      const listselected = new Set(this.selectedItems);

      if(this.selectedItems.length == 5){ 
        if(event.target.checked == true){
            event.target.checked = false;
            this.showErrorAlert();
            return
        }else{
            this.selectedItems.length = this.selectedItems.length - 1;
            const name = this.selectedIndex;
            const foundObject = [...listselected].find(obj => obj.Name === name);
            listselected.delete(foundObject)
         }
      }else{
         if(event.target.checked){
            console.log('aaaaaaa');
            const name = this.selectedIndex;
            const foundObject = [...listselected].find(obj => obj.Name === name);
            if(!listselected.has(foundObject)){
               listselected.add({Id : this.questionId, Name : this.selectedIndex, Selected : false ,Answer : this.Answer, SelectedAnswer :false, Mark : 0, Comment : null});
            }
         } else {
            console.log('oooooo');
            const name = this.selectedIndex;
            const foundObject = [...listselected].find(obj => obj.Name === name);
            listselected.delete(foundObject)
            //listselected = new Set(...Array.from(listselected).filter((item)=>{return item.Name!=name}));
         }
      }
      this.selectedItems = [...Array.from(listselected)];
      

   }

   handledelete(event){
      const questionToDelete = event.target.closest('.bubblequestion').dataset.delete;
      const listselected = new Set(this.selectedItems);
      const foundObject = [...listselected].find(obj => obj.Name === questionToDelete);
      listselected.delete(foundObject)
      this.selectedItems = [...Array.from(listselected)];

   }
   
   handleselectedquestions(event){
      this.click ++;
      if(this.click % 2 === 0){
         this.items = false; 
      }else{
         this.items = true; 
      }
      console.log(this.items)
   }

   handlebacktosection(){
      this.sectionVisibility = true;
   }

   handlebacktosubsection(){
      this.cards = true;
   }

   handlebacktosectionfr(){
      this.sectionVisibility = true;
   }

   showErrorAlert() {
      const message = 'SORRY, BUT YOU CANNOT CHOOSE MORE THAN 15 QUESTIONS';
      const variant = 'error';
      const title = 'Error';
      const options = [
          { label: 'OK', variant: 'brand' }
      ];

      const event = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
          mode: 'dismissable',
          duration: 5000,
          messageTemplateData: {},
          messageTemplate: '',
          type: ''
      });

      this.dispatchEvent(event);
  }
  handlebundlevisibility(){
    if (this.selectedItems.length == 0) {
      const toastEvent = new ShowToastEvent({
        title: 'Warning',
        message: 'The selected questions list is empty !',
        variant: 'warning'
      });
      this.dispatchEvent(toastEvent);
    }else{
      this.bundleVisibility = true;
    }

  }

  handlebacktoquestions(){
   this.bundleVisibility = false;
  }

  handlebuttonfilter(){
    this.filterchoice = false;
    this.avaiblechoice = true;
    this.selectedItems.splice(0, this.selectedItems.length);

  }

  handlebuttonbundle(){
    this.filterchoice = false;
    this.avaiblechoice = false;
    this.Existingbundle = true;
    this.selectedItems.splice(0, this.selectedItems.length);

  }

  handleBackToHome(){
    this.filterchoice = true;
  }


  handleCircleClick(event){
      const name = event.target.closest('.circle').dataset.name;
      this.selectedItems = this.selectedItems.map(item => {
         if(item.Name==name){
            return { ...item, Selected: !item.Selected };   
         }
         return item;
     });
  }

  handleShowResponse(event){
      const quest = event.target.closest('.circleshow').dataset.quest;

      console.log(quest);
      this.selectedItems = this.selectedItems.map(item => {
         if(item.Name==quest){
            return {...item, SelectedAnswer :!item.SelectedAnswer};   
         }
         return item;
     });
  }

  handleTextAreaChange(event){
      const comment = event.target.value;
      const name = event.target.closest('.left').dataset.name;

      this.selectedItems = this.selectedItems.map(obj => {
         if (obj.Name == name) {
           return { ...obj, Comment: comment }; // replace name property of object with id 2
         } else {
           return obj; // return original object for all other cases
         }
       });
  }

   handleMarkChange(event) {
      const mark = event.target.value;
      const name = event.target.closest('.right').dataset.name;

      this.selectedItems = this.selectedItems.map(obj => {
         if (obj.Name == name) {
           return { ...obj, Mark: mark }; // replace name property of object with id 2
         } else {
           return obj; // return original object for all other cases
         }
       });      
   }  

   handleSubmit(event) {
      if(this.selectedItems.length) {
         const listToPush = this.selectedItems.map(obj => { return {Id : obj.Id, Mark__c : obj.Mark, Comment__c : obj.Comment}});
         createQuestionsResponses({selectedEntries : listToPush, evaluationId : this.currentEvaluation})         
         .then((result) => {
            const toastEvent = new ShowToastEvent({
               title: 'Success',
               message: 'This interview has been saved successfully!',
               variant: 'Success'
             });
             this.dispatchEvent(toastEvent);
         }).catch((error) => {
            const toastEvent = new ShowToastEvent({
               title: 'Error',
               message: 'An Error Occured!',
               variant: 'Error'
             });
             this.dispatchEvent(toastEvent);
             console.log(error);
         });
         changeEvaluationStatus({evaluationId : this.currentEvaluation})
         .then((result) => {

           console.log('Done');

         }).catch((error) => {

            console.log(error);
            
         });

         this.isModalOpen = true;
      }
   }
   handleBundleName(event){
      this.bundleName = event.target.value;
   }
   handleBundleDesc(event){
      this.bundleDesc = event.target.value;
   }
   doNotSaveBundle(){
      location.reload();
   }
   doSaveBundle(){
      const listToPush = this.selectedItems.map(obj => { return {Id : obj.Id}});
      this.isModalOpen = false;
      createBundle({selectedEntries : listToPush ,interviewer : this.interviewerId, bundleName : this.bundleName, bundleDesc : this.bundleDesc})         
      .then((result) => {
         const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'The bundle has been created successfuly',
            variant: 'Success'
          });
          this.dispatchEvent(toastEvent);
      }).catch((error) => {
         const toastEvent = new ShowToastEvent({
            title: 'Error',
            message: 'An Error Occured!',
            variant: 'Error'
          });
          this.dispatchEvent(toastEvent);
          console.log(error);
      }); 
      location.reload();
   }
   
  
   handleBundleQuestionsVisibility(event){
      this.Existingbundle = false;
      this.playlistId = event.target.closest('.ag-item').dataset.playlistid; 
      this.playlistName = event.target.closest('.ag-item').dataset.playlistname;
      this.selectedItems.splice(0, this.selectedItems.length);
      
   }
   handleBackchoosebundle(event){
      this.Existingbundle = true;

   }
}