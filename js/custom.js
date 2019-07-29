$('document').ready(function(){
      if ($("#mybarChart1").length) {
        var f = document.getElementById("mybarChart1");
        var activeData = $('.init_values').val();
        activeData = activeData.split(',');
        var summary = new Chart(f, {
            type: "bar",
            data: {
                labels: ["Visitor's", "Call's", "Navigation's"],
                datasets: [{
                    label: "#",
                    backgroundColor: ["#fff568","#0d92bb","#1cbcb4"],
                    data: activeData
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: !0
                        }
                    }]
                }
            }
        })
    }

    $('.change_vendor').change(function(){
      today = $(this).find(':selected').data('today');
      week = $(this).find(':selected').data('week');
      month = $(this).find(':selected').data('month');
      $('.day-chart').attr('data-values', today);
      $('.week-chart').attr('data-values', week);
      $('.month-chart').attr('data-values', month);
      console.log(month);
      dataset_var = $('.day-chart').attr('data-values');
      dataset_var = dataset_var.split(',');
      visitor = dataset_var[0];
      $('.visitor-summary').html('Visitors<br>'+visitor);
      call = dataset_var[1];
      $('.call-summary').html('Calls<br>'+call);
      navigation = dataset_var[2];
      $('.navigation-summary').html('Navigations<br>'+navigation);
      data = summary.config.data;
      data.datasets[0].data = dataset_var;
      summary.update();
      $('.change_chart').removeClass('active');
      $('.change_chart.day-chart').addClass('active');
    });

    $('.change_chart').click(function(e){
      $('.change_chart').removeClass('active');
      $(this).addClass('active');
      dataset = $(this).attr('data-values');
      dataset = dataset.split(',');
      visitor = dataset[0];
      $('.visitor-summary').html('Visitors<br>'+visitor);
      call = dataset[1];
      $('.call-summary').html('Calls<br>'+call);
      navigation = dataset[2];
      $('.navigation-summary').html('Navigations<br>'+navigation);
      data = summary.config.data;
      data.datasets[0].data = dataset;
      summary.update();
    });

    localStorage.setItem("viewclinic", "0");
    $("#datatable-responsive").DataTable();
    $("#datatable-responsive-discount,#datatable-responsive-request").DataTable({
        "bSort" : false
    });

    $(document).on('change', '.btn-file :file', function() {
      var input = $(this),
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [label]);
    });
    
    $('body').on('fileselect', '.btn-file :file', function(event, label) {
		  var input = $(this).parents('.input-group').find(':text'),
      log = label;
      if( input.length ) {
        input.val(log);
        var currentnames = $('.gallery_image_name').val();
        if(currentnames == ''){
          $('.gallery_image_name').val(log);
        }else{
          $('.gallery_image_name').val(currentnames+','+log);
        }
      }
    });

    $('body').on('change', '[id^=imgInp]', function(e) {
      var currentThis = $(this);
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          currentThis.parent().parent().parent().parent().parent().find('.img-upload-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);
      }
    }); 

    $('.addimage').click(function(e){
        e.preventDefault();
        var currentImagesCount = $('.image_count').val();
        currentImagesCount++;
        $('.image_count').val(currentImagesCount);
        var copyHtml = '<div class="col-md-3 single_image"><img class="img-upload-preview" src="/images/sample_image.jpg"/><div class="form-group"><div class="input-group"><span class="input-group-btn"><span class="btn btn-default btn-file">Browse… <input type="file" name="gallery_image[]" id="imgInp'+currentImagesCount+'" data-counter="'+currentImagesCount+'"></span></span><input type="text" class="form-control" readonly></div></div><a class="btn btn-danger removeimage"><i class="fa fa-minus"></i></a></div>';
        $('.all_images').append(copyHtml);
    })

    $('body').on('click', '.removeimage', function (e){
      e.preventDefault();
      var currentname = $(this).parent().find(':text').val();
      var currentnames = $('.gallery_image_name').val();
      currentnames = currentnames.replace(','+currentname,'');
      currentnames = currentnames.replace(currentname,'');
      if(currentnames.charAt(0) == ','){
        currentnames = currentnames.substr(1);
      }
      $('.gallery_image_name').val(currentnames);
      $(this).closest('.single_image').remove();
    })
    
    $('.addtiming').click(function(e){
        e.preventDefault();
        var copyHtml = $(this).parent().parent().find('.copy_timings').html();
        $(this).parent().parent().append(copyHtml);
    })

    $('body').on('click', '.removetiming', function (e){
        e.preventDefault();
        $(this).closest('.copied_html').remove();
    })

    $('body').on('click', '.view_clinic', function (e){
        var address = $(this).parent().find('input[name^=clinic_address]').val();
        $('#pac-input').val(address);
        $('.clinics_wrap').data('check',1);
        addressToGeocode(address);
    })

    $('body').on('click', '.remove_clinic', function (e){
        $(this).closest('.single_clinic').remove();
    })

    $('#pac-input').on('keyup keypress', function(e) {
        $('.clinics_wrap').data('check',0);
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
          e.preventDefault();
          return false;
        }
    });
});

    
     
       
      /////////////////////////////////////
      var map;
      var placeMarkers = [];
      var input;
      var searchBox;
      var curposdiv;
      var curseldiv;
      function deletePlacesSearchResults() {
        for (var i = 0, marker; marker = placeMarkers[i]; i++) {
          marker.setMap(null);
        }
        placeMarkers = [];
        input.value = ''; // clear the box too
      }
      /////////////////////////////////////
      function initialize() {
        map = new google.maps.Map(document.getElementById('map'), { //var
          zoom: 12,//10,
          center: new google.maps.LatLng(24.8998373,91.8258764),//(22.344, 114.048),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true
        });
        curposdiv = document.getElementById('curpos');
        curseldiv = document.getElementById('cursel');       
     
        
        //~ initSearch();
        // Create the search box and link it to the UI element.
         input = /** @type {HTMLInputElement} */( //var
            document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
        //
        var DelPlcButDiv = document.createElement('div');
        //~ DelPlcButDiv.style.color = 'rgb(25,25,25)'; // no effect?
        DelPlcButDiv.style.backgroundColor = '#fff';
        DelPlcButDiv.style.cursor = 'pointer';
        DelPlcButDiv.innerHTML = 'DEL';
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(DelPlcButDiv);
        google.maps.event.addDomListener(DelPlcButDiv, 'click', deletePlacesSearchResults);
        searchBox = new google.maps.places.SearchBox( //var
          /** @type {HTMLInputElement} */(input));
        
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          for (var i = 0, marker; marker = placeMarkers[i]; i++) {
            marker.setMap(null);
          }
          // For each place, get the icon, place name, and location.
          placeMarkers = [];
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0, place; place = places[i]; i++) {
            var image = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
              map: map,
              icon: image,
              title: place.name,
              position: place.geometry.location
            });
            
          var c, lc;
          var city = null;
          if (place.address_components != null){
            for (c = 0, lc = place.address_components.length; c < lc; c += 1) {
              component = place.address_components[c];
  
              if (component.types[0] === 'locality') {
                  city = component.long_name;
                  break;
              }
          }
          }
          viewClinicStatus = $('.clinics_wrap').data('check');
          if(viewClinicStatus != 1){
              var html = '<div class="single_clinic"><a href="javascript:void(0)" class="view_clinic"><i class="fa fa-eye"></i></a><a href="javascript:void(0)" class="remove_clinic"><i class="fa fa-times"></i></a><div class="form-group"><label>Clinic Name</label><input type="text" name="clinic_name[]" value="'+place.name+'" class="form-control"/></div><div class="form-group"><label>Clinic Address</label><input type="text" name="clinic_address[]" value="'+jQuery('#pac-input').val()+'" class="form-control"/></div><div class="form-group"><label>Clinic City</label><input type="text" name="clinic_city[]" value="'+city+'" class="form-control"/></div><div class="form-group"><label>Clinic Co-ordinates</label><input type="text" name="clinic_coordinates[]" value="'+place.geometry.viewport.na.l+','+place.geometry.viewport.ga.l+'" class="form-control"/></div></div>'
              jQuery('.clinics_wrap').append(html);
              localStorage.setItem("viewclinic", "0");
          }
            placeMarkers.push(marker);
            bounds.extend(place.geometry.location);
          }
          map.fitBounds(bounds);
          var listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 18) map.setZoom(18); 
            google.maps.event.removeListener(listener); 
          });
        });
        
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
          curposdiv.innerHTML = "<b>curpos</b> Z: " + map.getZoom() + " C: " + map.getCenter().toUrlValue();
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);


 
      var locateDataContainer = false;
      var locateData = false;
      var geocoder= new google.maps.Geocoder();
function addressToGeocode( address ) {

  geocoder.geocode( { address: address }, function ( results, status ) {
    
    if ( status == 'OK' ) {
      
      var result = results[ 0 ];
      
      var markerPosition = new google.maps.LatLng( result.geometry.location.lat(), result.geometry.location.lng() );
      var locateMarker = new CustomMarker( markerPosition, map, { });

      if ( locateData ) {

        locateData.remove();

      }

      locateData = locateMarker;
      
      map.setCenter( markerPosition );
      map.setZoom( 18 );
      
      
      
      results.forEach( function ( result, resultIndex ) {
        
        var item = document.createElement( 'div' );

        item.className = 'item';
        item.innerHTML = result.formatted_address;

        setTimeout(function() {

          

        }, 100 * resultIndex );
        
        [ result.geometry.location.lat(), result.geometry.location.lng() ].forEach( function ( value, index ) {
          
          var item = document.createElement( 'div' );

          item.className = 'item';
          item.innerHTML = ( index == 0 ? 'lat: ' : 'lon:' ) + value;

          setTimeout(function() {
            
            
            
          }, 100 * resultIndex * index );
          
        });
        
      } );
    }
})
}

function CustomMarker( latlng, map, args ) {

    this.latlng = latlng;
    this.args = args;
    this.setMap( map );
  
  }
    
  CustomMarker.prototype = new google.maps.OverlayView();
  
  CustomMarker.prototype.draw = function () {
      
      var context = this;
      
      var div = this.div;
      
      if ( !div ) {
      
          div = this.div = document.createElement('div');
          
          div.className = 'marker-user-location';
          
          if ( 'marker_id' in context.args ) {
        
              div.dataset.marker_id = context.args.marker_id;
        
          }
      
      if ( typeof context.args.onClickHandler == 'function' ) {
        
        div.style.cursor = 'pointer';
        
        google.maps.event.addDomListener( div, 'click', context.args.onClickHandler );
        
      } else {
          
        google.maps.event.addDomListener( div, 'click', function ( event ) {
  
          google.maps.event.trigger( context, 'click' );
  
        });
        
      }
          
          var panes = this.getPanes();
      
          panes.overlayImage.appendChild( div );
      
      }
      
      var point = this.getProjection().fromLatLngToDivPixel( this.latlng );
      
      if ( point ) {
      
          div.style.left = point.x + 'px';
          div.style.top = point.y + 'px';
      
      }
    
  };
  
  CustomMarker.prototype.remove = function () {
    
    this.setMap( null );
    
      if ( this.div ) {
      
          this.div.parentNode.removeChild( this.div );
          this.div = null;
      
      }
    
  };
  
  CustomMarker.prototype.getPosition = function() {
    
      return this.latlng;	
    
  };

  function codeLatLng(lat, lng) {
 
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
		//alert (results[0].address_components[3].short_name);
		
			
 
         //formatted address
     //    alert(results[0].formatted_address)
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {
			         
 
            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "locality") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
        //city data 
		alert(city.long_name)
		
 
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }