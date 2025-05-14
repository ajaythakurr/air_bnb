(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  

// This is the script for the tax info switch-------------------------
let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click",()=>{
    let taxInfo= document.getElementsByClassName("tax-info");
    for(info of taxInfo){
        if(taxSwitch.checked){
            info.style.display = "block";
        }else{
            info.style.display = "none";
        }
    }
})