import jwt from "jsonwebtoken";
import * as yup from "yup";
import Auth from "../../config/AuthConfig";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(402).json({ error: "Validation fails" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "User does not exists " });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, Auth.secret, {
        expiresIn: Auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
