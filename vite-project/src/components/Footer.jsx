import React from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgb(214, 236, 253)',
        padding: '40px 0',
        marginTop: '5rem',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Information */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              #220-4014 Macleod Trail SE
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              Calgary, Alberta
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              T2G 2R7
            </Typography>
          </Grid>

          {/* Social Media Icons */}
          <Grid item xs={12} sm={4} md={3}>
            <Box display="flex" justifyContent="center" gap={2}>
              <Link href="https://wa.me/message/MP5REIEBJK6RK1" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/11062b_708ed96dfeaf4cdb82d8a2299d7625dc~mv2.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_708ed96dfeaf4cdb82d8a2299d7625dc~mv2.png"
                  alt="WhatsApp"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
              <Link href="https://www.instagram.com/resilientheartsinc" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/40898a93cfff4578b1779073137eb1b4.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/40898a93cfff4578b1779073137eb1b4.png"
                  alt="Instagram"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
              <Link href="https://www.facebook.com/resilientheartsinc" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/aebe5b6fd55f471a936c72ff2c8289d7.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aebe5b6fd55f471a936c72ff2c8289d7.png"
                  alt="Facebook"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
              <Link href="https://www.linkedin.com/company/resilient-hearts-inc" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/fcfebdfae12a44f993a94aeed8e2e66b.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fcfebdfae12a44f993a94aeed8e2e66b.png"
                  alt="LinkedIn"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
              <Link href="https://www.youtube.com/@resilientheartsinc" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/a1fed5f687844a6e8f42e017f71dfcb4.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a1fed5f687844a6e8f42e017f71dfcb4.png"
                  alt="YouTube"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
              <Link href="https://www.tiktok.com/@resilientheartsinc" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://static.wixstatic.com/media/11062b_c7468ec61d494ead83af6058b76cadc0~mv2.png/v1/fill/w_64,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_c7468ec61d494ead83af6058b76cadc0~mv2.png"
                  alt="TikTok"
                  style={{ width: '32px', height: '32px' }}
                />
              </Link>
            </Box>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)', marginTop: '16px' }}>
              Tel: +1-403-338-7869
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              Fax: +1-403-338-7869
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              Email: <Link href="mailto:info@resilienthearts.ca" color="inherit">info@resilienthearts.ca</Link>
            </Typography>
          </Grid>

          {/* LGBTQ2+ Flag and "We Accept Everyone" */}
          <Grid item xs={12} sm={4} md={3}>
            <img
              src="https://static.wixstatic.com/media/2ffea7_ca5792c3029d494fbd85870b494a2aa7~mv2.webp/v1/fill/w_230,h_194,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3960_WEBP.webp"
              alt="LGBTQ2+ Flag in Heart Shape"
              style={{ width: '115px', height: '97px', marginBottom: '16px' }}
            />
            <Typography variant="body1" style={{ fontStyle: 'italic', color: 'rgb(0, 74, 173)' }}>
              We Accept Everyone
            </Typography>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'rgb(0, 74, 173)' }}>
              Subscribe to Resilient Hearts Newsletter
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                placeholder="Enter your email here*"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: '2px solid rgb(0, 74, 173)'
                }}
              />
              <Button variant="contained" color="primary" fullWidth>
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Land Acknowledgment */}
        <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic', color: 'gray' }}>
          At Resilient Hearts Inc., we humbly acknowledge that the land on which we operate is the traditional territory of the Niitsitapi (Blackfoot) and the people of the Treaty 7 region, which includes the Siksika, Piikani, Kainai, Tsuut'ina, and Stoney Nakoda First Nations, including Chiniki, Bearspaw, and Wesley First Nations. We honor and respect the longstanding connections of Indigenous peoples to this land and recognize the importance of reconciliation, understanding, and collaboration as we strive to create a welcoming space for all.
        </Typography>

      </Container>
    </Box>
  );
};

export default Footer;