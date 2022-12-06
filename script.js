  //US VERSION
  // 
	function get_values(e){
		document.querySelector("form").addEventListener("submit", get_values );
		var formReturn = document.getElementById('xmlCleaner-form');
		

		//clear textarea
		document.getElementById("final-textbox").value = "";


		//get form values
		const xmlCodeRaw = document.getElementById("xmlCode").value;
		const pageIDRaw = document.getElementById("pageID").value;
		const xmlFileNameRaw = document.getElementById("fileName").value;

		//set file name

		if(xmlFileNameRaw.includes(".xml") != true){
			var xmlFileName = xmlFileNameRaw.replace(/\s/g, '_') + '.xml';
			document.getElementById('download-button-area').innerHTML = '<a download="' + xmlFileName + '" id="downloadlink" style="display: none">Download</a></span>';
			// console.log(xmlFileName)
		}else{
			var xmlFileName = xmlFileNameRaw.replace(/\s/g, '_');
			document.getElementById('download-button-area').innerHTML = '<a download="' + xmlFileName + '" id="downloadlink" style="display: none">Download</a></span>';
			// console.log(xmlFileName)
		}

		//Set XML heading
		document.getElementById('final-textbox').value += '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' + '<library xmlns="http://www.demandware.com/xml/impex/library/2006-10-31" library-id="iRobotSharedLibrary">' + '\r\n'
		var pageIDListAlert = pageIDRaw.split(',');
		var pageIDNoSpace = pageIDRaw.replace(/\s/g, '');
		var pageIDList = pageIDNoSpace.split(',');

		for (let i = 0; i < pageIDList.length; i++) {

		//check to see if page id is in XML
		var xmlCodeCheck = xmlCodeRaw.includes('<content content-id="' + pageIDList[i] + '">');
		if(xmlCodeCheck != true){
			alert(pageIDListAlert[i] + ' is not a valid page ID');
			document.getElementById("final-textbox").value = "";
			break;

		}else{

		//get page xml
		var xmlCodeSplit = xmlCodeRaw.split('<content content-id="' + pageIDList[i] + '">');
		var pageContentSplit = xmlCodeSplit[1].split("</content>");
		var pageContent = pageContentSplit[0];
		var pageContentFull = '<content content-id="' + pageIDList[i] + '">' + pageContent + '</content>';

		//add to text area
		document.getElementById('final-textbox').value += pageContentFull + '\r\n';

		//get component content
		var componentListRaw = pageContent.split('<content-link content-id="');
		// console.log('COMP LENGTH:' + componentListRaw.length);

		//set arrays for the loops 
		var pageContentValues = [];
		var compContentValues = [];
		var secondCompContentValues = [];

		//getting IDs for components on the page
		for (let i = 1; i < componentListRaw.length; i++) {
			var compIDSplit = componentListRaw[i].split('"');
			var compID = compIDSplit[0];

			//get content 
			var compDataRaw = xmlCodeRaw.split('<content content-id="' + compID + '">');
			var compDataSplit = compDataRaw[1].split("</content>");
			var compData = compDataSplit[0];
			var compDataFull = '<content content-id="' + compID + '">' + compData + '</content>';
			compContentValues[i] = compDataFull;

			//add to text area
			document.getElementById('final-textbox').value += compDataFull + '\r\n';

			//get any second level components
			var secondCompListRaw = compData.split('<content-link content-id="');

			if(secondCompListRaw.length > 1){
				for (let i = 1; i < secondCompListRaw.length; i++) {
					var secondCompIDSplit = secondCompListRaw[i].split('"');
					var secondCompID = secondCompIDSplit[0];

					//get content 
					var secondCompDataRaw = xmlCodeRaw.split('<content content-id="' + secondCompID + '">');
					var secondCompDataSplit = secondCompDataRaw[1].split("</content>");
					var secondCompData = secondCompDataSplit[0];
					var secondCompDataFull = '<content content-id="' + secondCompID + '">' + secondCompData + '</content>';
					secondCompContentValues[i] = secondCompDataFull;

					//add to text area
					document.getElementById('final-textbox').value += secondCompDataFull + '\r\n';
					
					// console.log('SECOND COMP DATA:' + secondCompDataFull)
				}	
			}else{

			}


			// console.log('COMP ID:' + compID);
			// console.log('SECOND COMP LENGTH:' + secondCompListRaw.length);
			// console.log('COMP DATA:' + compDataFull);
		}
	}

	}
		//Set XML footer
		document.getElementById('final-textbox').value += '</library>'

		//display create button 
		document.getElementById('create').style.display = 'block';
		e.preventDefault(formReturn)


	}

function createFile () {
var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


  var create = document.getElementById('create'),
    textbox = document.getElementById('final-textbox');

    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(textbox.value);
    link.style.display = 'block';
}
