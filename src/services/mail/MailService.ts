import mailgunFactory from 'mailgun-js';
import qs from 'querystring';
import logger from '../../config/logger';
import IEnvelope from './envelopes/IEnvelope';

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  NODE_ENV
} = process.env;

const mailgun = mailgunFactory({
  apiKey: MAILGUN_API_KEY as string,
  domain: MAILGUN_DOMAIN as string,
  testMode: (NODE_ENV === 'development'),
  testModeLogger: (options, payload) => {
    logger.info(JSON.stringify(qs.parse(payload), null, 2));
  }
});

class MailService {
  public static async sendToEmail(email: string, envelope: IEnvelope): Promise<void> {
    const data = {
      from: MAILGUN_FROM,
      to: email,
      subject: envelope.subject,
      text: envelope.text,
      inline: envelope.attachment,
      html: envelope.html,
    };

    await new Promise<void>((resolve, reject) => {
      void mailgun.messages().send(data, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

export default MailService;
