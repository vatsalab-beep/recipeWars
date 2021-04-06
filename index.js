
const input1 = document.querySelector('#input1');

const input2 = document.querySelector('#input2');
const container = document.querySelector('.container');
const warBtn = document.querySelector('#war');

async function searchFoodData (recipe){

    const res = await axios.get('https://api.spoonacular.com/recipes/autocomplete',{
    params:{
        query:recipe,
        number:5,
        apiKey: '7fddc6c72a9443089d902406dcfb8c5a',
    }
    });
    return res.data;
}
//get data of recipe through ID
async function getRecipeDataWithId (id){
const apiUrl  = 'https://api.spoonacular.com/recipes/' + id + '/information'
    const res = await axios.get( apiUrl, {
        params: {
            includeNutrition:false,
            apiKey: '7fddc6c72a9443089d902406dcfb8c5a',
        }
    });
    return res.data;
}
//get data of recipe through recipe Name
async function getRecipeDataWithName (recipeName){
    const searchResults = await searchFoodData(recipeName);
    const idForRecipeSelected= searchResults[0].id;
    const recipeinfo = await getRecipeDataWithId(idForRecipeSelected);
    return recipeinfo;
}

function  debounce   (func,secs) 

{ 
    let timeoutId;
    return (...args) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId= setTimeout(() => {
        func.apply(null,args);
        }, secs);
    }
}

function createDivwithText (text, classForDiv,classForText){
    const box = document.createElement('div');
    if(classForDiv)
        box.classList.add (classForDiv);
    const newtext = document.createElement ('h3');
    if(classForText)
        newtext.classList.add(classForText);
    newtext.innerText = text;
    box.append(newtext);
    return box;
}
function closeDropdown (parent)
{
    //remove all childnodes except first 3

    while (parent.childNodes.length > 3) {
        parent.removeChild(parent.lastChild);
    }
}


function openDropDown (arrayOfText,container){
       
    for (let text of arrayOfText){
        const div = createDivwithText(text.title,'box', 'searchResult');
        container.append(div);
     }
}


 async function onInput (e){

    const recipeContainer = e.target.parentElement.parentElement;
    closeDropdown(e.target.parentElement);
    closeDropdown(recipeContainer);

    const searchResults = await searchFoodData(e.target.value);

     openDropDown(searchResults,e.target.parentElement);
     //allow user to click option out of drop down
    const results = document.querySelectorAll('.searchResult');
    for ( result of results){
     
        result.addEventListener ('click', function (){
        
            e.target.value = this.innerText;
            //grab parent of input and then parent of that div
      
            onRecipeSelect(e.target.value, recipeContainer);
            closeDropdown(e.target.parentElement);

        })
    }
}



input1.addEventListener('input',debounce(onInput,300) ); 
input2.addEventListener('input',debounce(onInput,300));


const onRecipeSelect = async (recipeName, container) =>
{
    //displayRecipe Data in a div
    //create div to put data in 
    const recipeDataContainer = document.createElement('div');
    recipeDataContainer.className = 'information';
    const recipeData = await getRecipeDataWithName(recipeName);
    //loop through properties you want to display and put them in div and append 
    //div to container
    const properties = ['vegan','vegetarian', 'readyInMinutes', 'cheap', 'healthScore'];

    for ( prop of properties){

        const div = createDivwithText(`${prop}: ${recipeData[prop]}`  ,'box');
        div.classList.add(prop);
        recipeDataContainer.append(div);
    }
    //append container to document
    container.append(recipeDataContainer);
  
}

const compareRecipeData = (recipe1div, recipe2div) =>
{
    //extract the items to compare from teh div 

    const recipe1Text = recipe1div.firstChild.innerText.split(': ');
    const recipe2Text = recipe2div.firstChild.innerText.split(': ');

    let recipe1val = recipe1Text[1];
    let recipe2val = recipe2Text[1];

     if ( recipe1val === recipe2val)
    {  console.log('they are equal');
        return 'equal'
    }
  

    if ( recipe1val !== 'true' && recipe1val !== 'false')
    {
        console.log('number entered');
        recipe1val = parseInt(recipe1val);
        recipe2val = parseInt(recipe2val);
        const largerNumber =  Math.max(recipe1val,recipe2val);
        
        if ( recipe1val === largerNumber)
        {
            return {winner: recipe1div,
                loser: recipe2div,
        };
        }
            
        if(recipe2val === largerNumber)
        {
            return {winner: recipe2div,
                loser: recipe1div,
                };

        }
    
    }
    else {
     
        if ( recipe1val === 'true')
        {
            return {winner: recipe1div,
                loser: recipe2div,
        }
        }
        
        else{
            console.log('recipe2val should be returned');
            return {winner: recipe2div,
                loser: recipe1div,
        };
        }    

    }
    





  
}
const onWarClick = () =>
{
    const points =  "<h3>TotalPoints: <span class = 'totalPoints'></span></h3>";

    document.querySelector('#recipe1').innerHTML += points;
    document.querySelector('#recipe2').innerHTML += points;
    const recipe1info = document.querySelector('#recipe1 .information');
    const recipe2info =  document.querySelector('#recipe2 > .information');

    const objWithWinnerData = compareRecipeData(recipe1info.childNodes[4],recipe2info.childNodes[4]);
 
    if(objWithWinnerData === 'equal')
    {
        recipe1info.childNodes[4].classList.add('tie');
        recipe2info.childNodes[4].classList.add('tie');
    }
    else
    {
      objWithWinnerData.winner.classList.add('win');
      const totalPointsElement = objWithWinnerData.winner.parentElement.nextSibling.childNodes[1];
      totalPointsElement.innerText =+ 10;
      console.log();
      objWithWinnerData.loser.classList.add('lose');
    }
  
  

}



warBtn.addEventListener('click', async () =>{

onWarClick();

});
 
 

