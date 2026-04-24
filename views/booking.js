module.exports = () => {
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
              <i class="fas fa-clock"></i>
              <h3>Working Hours</h3>
              <p>Monday - Saturday: 9am - 7pm</p>
              <p>Sunday: Closed</p>
            </div>
            <div class="info-card">
              <i class="fab fa-whatsapp"></i>
              <h3>Contact</h3>
              <p>WhatsApp: +234 812 345 6789</p>
              <p>Response within 24 hours</p>
            </div>
            <div class="info-card">
              <i class="fas fa-map-marker-alt"></i>
              <h3>Location</h3>
              <p>Lagos, Nigeria</p>
              <p>Virtual consultations available</p>
            </div>
          </div>

          <div class="booking-form-container">
            <h2>Book Your Session</h2>
            <form id="bookingForm">
              <div class="form-group">
                <label><i class="fas fa-user"></i> Full Name *</label>
                <input type="text" name="name" id="bookingName" required placeholder="Enter your full name">
              </div>

              <div class="form-group">
                <label><i class="fas fa-phone"></i> Phone Number</label>
                <input type="tel" name="phone" id="bookingPhone" placeholder="For WhatsApp confirmation">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label><i class="fas fa-calendar"></i> Preferred Date *</label>
                  <input type="date" name="date" id="bookingDate" required>
                </div>

                <div class="form-group">
                  <label><i class="fas fa-clock"></i> Preferred Time *</label>
                  <select name="time" id="bookingTime" required>
                    <option value="">Select time</option>
                    <option value="9:00 AM - 12:00 PM">Morning (9am - 12pm)</option>
                    <option value="12:00 PM - 4:00 PM">Afternoon (12pm - 4pm)</option>
                    <option value="4:00 PM - 7:00 PM">Evening (4pm - 7pm)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label><i class="fas fa-cut"></i> Service Needed</label>
                <select name="service" id="bookingService">
                  <option value="">Select a service</option>
                  <option value="Wig Making">Wig Making</option>
                  <option value="Wig Revamping">Wig Revamping</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Hair Styling">Hair Styling</option>
                  <option value="Braiding">Braiding</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>

              <div class="form-group">
                <label><i class="fas fa-comment"></i> Additional Notes</label>
                <textarea name="notes" id="bookingNotes" rows="3" placeholder="Any special requests or information..."></textarea>
              </div>

              <button type="submit" class="submit-btn">
                <i class="fab fa-whatsapp"></i> Submit Booking via WhatsApp
              </button>
            </form>
            <div class="info-box">
              <i class="fas fa-info-circle"></i> After submitting, you'll be redirected to WhatsApp to confirm your booking with our team.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};