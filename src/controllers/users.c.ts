import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import AppDataSource from "../database/data-source";
import { Role } from "../database/entities/role.entity";
import { User } from "../database/entities/user.entity";
import { ROLES } from "../shared/constants/roles.constant";
import { hash } from "../utils/bcrypt";
import { RoleGuard } from "../lib/decorators/role-guard.decorator";
import { UnprocessableEntityException, BadRequestException } from "../lib/exceptions";

class UsersController {
    static readonly userRepository = AppDataSource.getRepository(User);
    static readonly roleRepository = AppDataSource.getRepository(Role);

    async test(req: Request, res: Response, next: NextFunction) {
        try {
            throw new UnprocessableEntityException({
                details: [{ issue: 'Invalid data' }]
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password)
                throw new BadRequestException({
                    details: [{ issue: "Body must contain {fullName, email, password}" }]
                })

            const isUserExists = await UsersController.userRepository.findOne({
                where: {
                    email
                }
            })
            if (isUserExists)
                throw new BadRequestException({
                    details: [{ issue: "Email already has an account" }]
                });

            const hashPassword = hash(password);

            const _role = await UsersController.findOrCreateRole(ROLES.USER);

            const user = await UsersController.userRepository.create({
                fullName,
                email,
                password: hashPassword,
                roles: [_role]
            }).save()

            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async updateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const _role = await UsersController.findOrCreateRole(role);

            const user = await UsersController.userRepository.findOne({
                where: {
                    id
                },
                relations: ['roles']
            })
            if (!user)
                throw new BadRequestException({
                    details: [{ issue: "Invalid userId" }]
                });

            const hasRole = user.roles.filter(userRole => userRole.id === _role.id);
            if (hasRole.length === 0)
                user.roles.push(_role);

            await UsersController.userRepository.save(user);

            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard(['admin'])
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UsersController.userRepository.find({
                relations: ['roles']
            })

            return res.status(200).json(users);
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard(['user', 'admin'])
    async getUserInformation(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.query;
            if (!email)
                throw new BadRequestException({
                    details: [{ issue: "Invalid email" }]
                });

            const user = await UsersController.userRepository.findOne({
                where: {
                    email: email.toString()
                },
                relations: ['roles']
            })

            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id)
                throw new BadRequestException({
                    details: [{ issue: "Invalid userId" }]
                });

            const user = await UsersController.userRepository.softDelete({ id })

            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    static async findOrCreateRole(roleName: string) {
        let role = await UsersController.roleRepository.findOne({
            where: {
                roleName: roleName
            }
        })
        if (!role) {
            role = await UsersController.roleRepository.create({
                roleName
            }).save()
        }
        return role;
    }
}

export default new UsersController;
