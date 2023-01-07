const months = [31,28,31,30,31,30,31,31,30,31,30,31];

function age(){
    let today = new Date();
    let inputDate = new Date(document.getElementById("date").value);
    let birthMonth,birthDate,birthYear;
    let birthDetails = {
        date:inputDate.getDate(),
        month:inputDate.getMonth()+1,
        year:inputDate.getFullYear()
    }
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth()+1;
    let currentDate = today.getDate();

    leapChecker(currentYear);

    if(
        birthDetails.year > currentYear ||
        ( birthDetails.month > currentMonth && birthDetails.year == currentYear) || 
        (birthDetails.date > currentDate && birthDetails.month == currentMonth && birthDetails.year == currentYear)
    ){
        alert("Not Born Yet");
        displayResult("-","-","-");
        return;
    }

    birthYear = currentYear - birthDetails.year;

    if(currentMonth >= birthDetails.month){
        birthMonth = currentMonth - birthDetails.month;
    }
    else{
        birthYear--;
        birthMonth = 12 + currentMonth - birthDetails.month;
    }

    if(currentDate >= birthDetails.date){
        birthDate = currentDate - birthDetails.date;
    }
    else{
        birthMonth--;
        let days = months[currentMonth - 2];
        birthDate = days + currentDate - birthDetails.date;
        if(birthMonth < 0){
            birthMonth = 11;
            birthYear--;
        }
    }
    displayResult(birthDate,birthMonth,birthYear);
}

function displayResult(bDate,bMonth,bYear){
    document.getElementById("years").textContent = bYear;
    document.getElementById("months").textContent = bMonth;
    document.getElementById("days").textContent = bDate;
}

function leapChecker(year){
    if(year % 4 == 0 || (year % 100 == 0 && year % 400 == 0)){
        months[1] = 29;
    }
    else{
        months[1] = 28;
    }
}



var db=openDatabase("Age","1.0","Age",65535); // itemDB is the database name


$(function(){

loadData(); //loading our records



//CREATING TABLE STARTS HERE

$("#create").click(function(){
db.transaction(function(transaction){
    var sql="CREATE TABLE Age "+
    "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
    "years VARCHAR(100) NOT NULL,"+
    "months VARCHAR(100) NOT NULL,"+
    "days VARCHAR(100) NOT NULL,"+
    "use INT(5) NOT NULL)";
    transaction.executeSql(sql,undefined,function(){
        alert("Table is created successfully");
    },function(){
        alert("Table is already being created");
    })
});
});
$("#submit").click(function(){
    var yr=$("#years").val();
    var mo=$("#months").val();
    var da=$("#days").val();
    db.transaction(function(transaction){
    var sql="INSERT INTO items(years,months,days) VALUES(?,?,?)";
    transaction.executeSql(sql,[yr,mo,da],function(){
        alert("New item is added successfully");
    },function(transaction,err){
        alert(err.message);
    })
    })
    })
    //FETCHING OUR RECORD
$("#list").click(function(){
    loadData();
    })
    //FUNCTION TO LOAD OUR RECORDS
    function loadData(){
		$("#itemlist").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM Age ORDER BY id DESC";
		transaction.executeSql(sql,undefined,function(transaction,result){
if(result.rows.length){

for(var i=0;i<result.rows.length;i++){
	var row=result.rows.item(i);
	var item=row.item;
	var id=row.id;
	var quantity=row.quantity;
	$("#itemlist").append('<tr id="del'+id+'"><td>'+id+'</td><td>'+item+'</td><td id="newqty'+id+'">'+quantity+'</td><td><a href="#" class="btn btn-danger deleteitem" data-id="'+id+'">Delete</a> <a href="#" class="btn btn-primary updateitem" data-id="'+id+'">Update</a></td></tr>');
}
}else{
	$("#itemlist").append('<tr><td colspan="3" align="center">No Item Found</td></tr>');
}
		},function(transaction,err){
			alert('No table found. Click on "Create Table" to create table now');
		})
	})




//setTimeout was used to execute codes inside it to be loaded after records are loaded/fetched.



}
//END OF loadData() function




});



