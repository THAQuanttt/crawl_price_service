import { NextFunction, Request, Response } from "express";
import AppDataSource from "../database/data-source";
import { User } from "../database/entities/user.entity";
import logger from "../utils/logger";
import { compareHash } from "../utils/bcrypt";
import { signToken } from "../utils/jwt";
import { BadRequestException } from "../lib/exceptions";

class AuthController {
    static readonly userRepository = AppDataSource.getRepository(User);

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                throw new BadRequestException({
                    details: [{ issue: "Body must contain {email, password}" }]
                })

            const user = await AuthController.userRepository.findOne({
                where: {
                    email
                },
                relations: ['roles']
            })

            if (!user)
                throw new BadRequestException({
                    details: [{ issue: "Email doesnt exist" }]
                });

            const isCorrectPassword = compareHash(password, user.password);
            if (!isCorrectPassword)
                throw new BadRequestException({
                    details: [{ issue: "Invalid password" }]
                });

            const accessToken = signToken({ userId: user.id, roles: user.roles.map(e => e.roleName) });
            const { password: pw, ...returnUser } = user;
            return res.status(200).json({ ...returnUser, accessToken });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new AuthController;