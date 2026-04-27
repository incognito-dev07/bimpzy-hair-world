module.exports = () => {
  var whatsappNumber = process.env.WHATSAPP_NUMBER;
  return `
    <div class="booking-page">
      <div class="booking-hero">
        <div class="container">
          <h1>Book an Appointment</h1>
          <p>Schedule your hair session with our expert stylists</p>
        </div>
      </div>

      <div class="container">
        <div class="booking-wrapper">
          <div class="booking-info">
            <div class="info-card">
              <i class="fab fa-whatsapp"></i>
              <h3>Contact</h3>
              <p>WhatsApp: +${whatsappNumber}</p>
              <p><b>Response within 12 hours</b></p>
            </div>
            <div class="info-card">
              <i class="fas fa-map-marker-alt"></i>
              <h3>Location</h3>
              <p>Akure, Ondo State, Nigeria</p>
              <p><b>Virtual consultations available</b></p>
            </div>
          </div>

          <div class="booking-form-container">
            <h2>Book Your Session</h2>
            <div id="bookingForm">
              <div class="form-group">
                <label><i class="fas fa-user"></i> Full Name</label>
                <input type="text" id="bookingName" placeholder="Enter your full name">
              </div>

              <div class="form-group">
                <label><i class="fas fa-phone"></i> Phone Number</label>
                <input type="tel" id="bookingPhone" placeholder="For WhatsApp confirmation">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label><i class="fas fa-calendar"></i> Preferred Date</label>
                  <div class="custom-date-wrapper">
                    <input type="date" id="bookingDate" class="custom-date-input">
                    <i class="fas fa-chevron-down date-icon"></i>
                  </div>
                </div>

                <div class="form-group">
                  <label><i class="fas fa-clock"></i> Preferred Time</label>
                  <div class="custom-select-wrapper">
                    <div class="custom-select-trigger" id="timeSelectTrigger">
                      <span>Select time</span>
                      <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="custom-select-dropdown" id="timeSelectDropdown">
                      <div class="custom-option" data-value="9am">Morning (9am)</div>
                      <div class="custom-option" data-value="12pm">Afternoon (12pm)</div>
                      <div class="custom-option" data-value="4pm">Evening (4pm)</div>
                    </div>
                    <input type="hidden" id="bookingTime" value="">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label><i class="fas fa-cut"></i> Service Needed</label>
                <div class="custom-select-wrapper">
                  <div class="custom-select-trigger" id="serviceSelectTrigger">
                    <span>Select a service</span>
                    <i class="fas fa-chevron-down"></i>
                  </div>
                  <div class="custom-select-dropdown has-scroll" id="serviceSelectDropdown">
                    <div class="custom-option" data-value="Wig Making">Wig Making</div>
                    <div class="custom-option" data-value="Wig Revamping">Wig Revamping</div>
                    <div class="custom-option" data-value="Repairs">Repairs</div>
                    <div class="custom-option" data-value="Hair Styling">Hair Styling</div>
                    <div class="custom-option" data-value="Braiding">Braiding</div>
                    <div class="custom-option" data-value="Consultation">Consultation</div>
                    <div class="custom-option" data-value="Hair Coloring">Hair Coloring</div>
                    <div class="custom-option" data-value="Hair Cutting">Hair Cutting</div>
                    <div class="custom-option" data-value="Hair Extensions">Hair Extensions</div>
                    <div class="custom-option" data-value="Scalp Treatment">Scalp Treatment</div>
                  </div>
                  <input type="hidden" id="bookingService" value="">
                </div>
              </div>

              <div class="form-group">
                <label><i class="fas fa-comment"></i> Additional Notes</label>
                <textarea id="bookingNotes" rows="3" placeholder="Any special requests or information..."></textarea>
              </div>

              <button type="button" class="submit-btn" id="submitBookingBtn">
                <i class="fab fa-whatsapp"></i> Submit Booking via WhatsApp
              </button>
            </div>
            <div class="info-box">
              <i class="fas fa-info-circle"></i> After submitting, you'll be redirected to WhatsApp to confirm your booking with our team.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if (typeof initCustomDropdowns === 'function') {
          initCustomDropdowns();
        }
      });
    </script>
  `;
};