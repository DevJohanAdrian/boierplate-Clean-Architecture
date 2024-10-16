import { CreateUserDto, UpdateUserDto } from "@/application/dtos";
import { UserDatasource } from "@/application/interfaces";
import { UserEntity } from "@/domain";
import { CustomGeneralError } from "@/domain/customErrors/customGeneral.error";
import { prisma } from "@/infrastructure/database/PrismaConnection";
import { UserMapper } from "@/infrastructure/mappers/users/user.mapper";

export class UserDatasourceImpl implements UserDatasource {
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await prisma.users.create({data:createUserDto})
        return UserMapper.toDomain(user)
    }

    async updateById(updateUserDto: UpdateUserDto): Promise<UserEntity> {
       await this.getById(updateUserDto.id)

       const user = await prisma.users.update({
        where:{id:updateUserDto.id},
        data:updateUserDto
        })

        return UserMapper.toDomain(user)
    }
    async getAll(): Promise<UserEntity[]> {
        const users = await prisma.users.findMany();
        return users.map(user => UserMapper.toDomain(user) ) 
    }
    async getById(id: number): Promise<UserEntity> {
        const user = await prisma.users.findFirst({
            where: {
                id: id
            }
        })

        if (!user) throw new CustomGeneralError(`User with id: ${id} not found`, 404)
        return UserMapper.toDomain(user)
    }
    async deleteUser(id: number): Promise<UserEntity> {
        await this.getById(id)
        const deletedUser = await prisma.users.delete({where:{id}})

        return UserMapper.toDomain(deletedUser)
       
    }
   
}