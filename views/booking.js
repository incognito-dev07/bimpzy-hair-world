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
              <p>Akure, Nigeria</p>
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
                  <input type="date" id="bookingDate">
                </div>

                <div class="form-group">
                  <label><i class="fas fa-clock"></i> Preferred Time</label>
                  <div class="custom-select">
                    <select id="bookingTime">
                      <option value="">Select time</option>
                      <option value="9am">Morning (9am)</option>
                      <option value="12pm">Afternoon (12pm)</option>
                      <option value="4pm">Evening (4pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label><i class="fas fa-cut"></i> Service Needed</label>
                <div class="custom-select">
                  <select id="bookingService">
                    <option value="">Select a service</option>
                    <option value="Wig Making">Wig Making</option>
                    <option value="Wig Revamping">Wig Revamping</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Hair Styling">Hair Styling</option>
                    <option value="Braiding">Braiding</option>
                    <option value="Consultation">Consultation</option>
                  </select>
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
  `;
};