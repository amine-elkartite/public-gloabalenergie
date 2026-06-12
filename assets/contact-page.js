(function(){
  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function getField(form, name){
    var field = form.querySelector('[name="' + name + '"]');
    return field ? field.value.trim() : '';
  }

  function setStatus(el, text, type){
    el.textContent = text;
    el.className = 'ge-form-status ' + (type ? 'is-' + type : '');
  }

  ready(function(){
    var form = document.getElementById('geContactForm');
    var status = document.getElementById('geFormStatus');
    var whatsAppButton = document.getElementById('geWhatsAppButton');
    if(!form) return;

    function buildMessage(){
      var firstName = getField(form, 'firstName');
      var lastName = getField(form, 'lastName');
      var phone = getField(form, 'phone');
      var email = getField(form, 'email');
      var message = getField(form, 'message');
      var mailing = (form.querySelector('[name="mailingList"]:checked') || {}).value || 'No';
      return {
        firstName:firstName,
        lastName:lastName,
        phone:phone,
        email:email,
        message:message,
        mailingList:mailing,
        text:
          'Nouvelle demande de contact depuis le site Global Energie Events%0A%0A' +
          'Nom: ' + encodeURIComponent(firstName + ' ' + lastName) + '%0A' +
          'Telephone: ' + encodeURIComponent(phone) + '%0A' +
          'Email: ' + encodeURIComponent(email) + '%0A' +
          'Liste de diffusion: ' + encodeURIComponent(mailing) + '%0A%0A' +
          'Message:%0A' + encodeURIComponent(message)
      };
    }

    function refreshWhatsApp(){
      var data = buildMessage();
      whatsAppButton.href = 'https://wa.me/212661717581?text=' + data.text;
    }

    form.addEventListener('input', refreshWhatsApp);
    form.addEventListener('change', refreshWhatsApp);
    refreshWhatsApp();

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = buildMessage();
      if(!data.firstName || !data.lastName || !data.phone || !data.email || !data.message){
        setStatus(status, 'Veuillez completer tous les champs obligatoires.', 'error');
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
        setStatus(status, 'Veuillez saisir une adresse email valide.', 'error');
        return;
      }

      var saved = JSON.parse(localStorage.getItem('ge_contact_submissions') || '[]');
      saved.push({date:new Date().toISOString(), data:data});
      localStorage.setItem('ge_contact_submissions', JSON.stringify(saved));

      var subject = encodeURIComponent('Demande de contact - Global Energie Events');
      var body = data.text.replace(/%0A/g, '%0D%0A');
      window.location.href = 'mailto:contact@globalenergie.ma?subject=' + subject + '&body=' + body;
      setStatus(status, 'Votre demande est prete dans votre application email et sauvegardee localement.', 'success');
      form.reset();
      refreshWhatsApp();
    });
  });
})();
