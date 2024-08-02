import { User } from "../Models/useModel.js";
import { Requirements } from "../Models/RequirementsModel.js";
import { InfoSystem } from "../Models/systemModel.js";
import { Utils } from "../utils/UserUtils.js";

const utils = new Utils();

export default class ServiceControllerRequirements {
    //Função responsável por criar a equioe
    async createRequirements(req, res) {
        try {
            const { promoted, reason } = req.body;
            const idUser = req.idUser;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const nicknamePromoted = await User.findOne({ nickname: promoted });
            const validateSuperior = await utils.isSuperior(nicknameOperator, nicknamePromoted, "Promoção");
            const validete = await utils.isDiretor(nicknameOperator.patent);

            if (validateSuperior.isSuperior === true || nicknameOperator.userType === "Admin" || validete === true) {
                const newRequirement = {
                    promoted,
                    newPatent: validateSuperior.newPatent,
                    newMotto: `${promoted} - Promovido por [${nicknameOperator.tag}] em ${utils.getCurrentDate()}`,
                    reason,
                    patentOperador: nicknameOperator.patent,
                    operator: nicknameOperator.nickname,
                    typeRequirement: "Promoção",
                    status: "Pendente"
                };

                const createRequirement = await Requirements.create(newRequirement);

                if (!createRequirement) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
                }

                return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });

            }
            return res.status(422).json({ error: 'Ops! Você não tem permissão para promover esse usuário' });


        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    };

    async createRequirementsRelegation(req, res) {
        try {
            const { promoted, reason } = req.body;
            const idUser = req.idUser;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const nicknameRelegation = await User.findOne({ nickname: promoted });
            const validete = await utils.isDiretor(nicknameOperator.patent);
            const validateSuperior = await utils.isSuperior(nicknameOperator, nicknameRelegation, "Rebaixamento");



            if (validateSuperior.isSuperior === true || nicknameOperator.userType === "Admin" || validete === true) {
                const newRequirement = {
                    promoted,
                    newPatent: validateSuperior.newPatent,
                    newMotto: `${promoted} - Rebaixado por [${nicknameOperator.tag}] em ${utils.getCurrentDate()}`,
                    reason,
                    patentOperador: nicknameOperator.patent,
                    operator: nicknameOperator.nickname,
                    typeRequirement: "Rebaixamento",
                    status: "Pendente"
                };

                const createRequirement = await Requirements.create(newRequirement);

                if (!createRequirement) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
                }

                return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });

            }
            return res.status(422).json({ error: 'Ops! Você não tem permissão para rebaixar esse usuário reporte o caso para algum superior' });


        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    };

    async createRequirementsWarning(req, res) {
        try {
            const { promoted, reason } = req.body;
            const idUser = req.idUser;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const nicknameRelegation = await User.findOne({ nickname: promoted });

            const validateSuperior = await utils.isSuperior(nicknameOperator, nicknameRelegation, "Advertência");
            const validete = await utils.isDiretor(nicknameOperator.patent);

            if (validateSuperior.isSuperior === true || nicknameOperator.userType === "Admin" || validete === true) {
                const newRequirement = {
                    promoted,
                    newPatent: nicknameRelegation.patent,
                    reason,
                    patentOperador: nicknameOperator.patent,
                    operator: nicknameOperator.nickname,
                    typeRequirement: "Advertência",
                    status: "Pendente"
                };

                const createRequirement = await Requirements.create(newRequirement);

                if (!createRequirement) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
                }

                return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });
            }

            return res.status(422).json({ error: 'Ops! Você não tem permissão para adverter esse usuário reporte o caso para algum superior' });


        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    };


    async createRequirementsResignation(req, res) {
        try {
            const { promoted, reason } = req.body;
            const idUser = req.idUser;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const nicknameRelegation = await User.findOne({ nickname: promoted });

            if (nicknameRelegation.status === 'Demissão') {
                return res.status(404).json({ msg: "Ops! Este usuário não se encontra no quadro de funcionários." });
            };

            const validateSuperior = await utils.isSuperior(nicknameOperator, nicknameRelegation, "Demissão");
            const validete = await utils.isDiretor(nicknameOperator.patent);
            if (validateSuperior.isSuperior === true || nicknameOperator.userType === "Admin" || validete === true) {
                const newRequirement = {
                    promoted,
                    newPatent: "Civil",
                    newMotto: `${promoted} - Demitido por [${nicknameOperator.tag}] em ${utils.getCurrentDate()}`,
                    reason,
                    patentOperador: nicknameOperator.patent,
                    operator: nicknameOperator.nickname,
                    typeRequirement: "Demissão",
                    status: "Pendente"
                };

                const createRequirement = await Requirements.create(newRequirement);

                if (!createRequirement) {
                    return res.status(422).json({ error: 'Ops! Parece que houve um erro, tente novamente mais tarde.' });
                }

                return res.status(201).json({ msg: 'Requerimento postado com sucesso.' });
            }

            return res.status(422).json({ error: 'Ops! Você não tem permissão para adverter esse usuário reporte o caso para algum superior' });



        } catch (error) {
            console.error('Erro ao postar requerimento.', error);
            res.status(500).json({ msg: 'Erro ao postar requerimento.' });
        }
    };

    async ResignationUpdateUser(req, res) {
        try {
            const { idUser } = req.body;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const requirements = await Requirements.find({ operator: nicknameOperator.nickname });
            const post = requirements.slice(-1)[0];

            const nickname = await User.findOne({ nickname: post.promoted });

            if (!nickname) {
                res.status(404).json({ msg: 'Ops! Usuário não encontrado.' });
            } else {

                if (nickname.status === 'Desativado') {
                    return res.status(404).json({ msg: "Ops! Este usuário já se demitido." });
                };

                nickname.nickname = post.promoted;
                nickname.patent = post.newPatent;
                nickname.classes = "";
                nickname.teans = "";
                nickname.status = 'Desativado';
                nickname.tag = 'Vazio';
                nickname.warnings = '0';
                nickname.medals = '0';
                nickname.password = nickname.password;
                nickname.userType = "User";

                await nickname.save();
                res.status(200).json({ msg: 'Usuário atualizado com sucesso' });
            };

        } catch (error) {
            console.error('Não foi possível atualizar o usuário.', error);
            res.status(500).json({ msg: 'Não foi possível atualizar o usuário.' })
        }

    };

    async createContract(req, res) {
        try {
            const { promoted, patent, reason } = req.body;
            const idUser = req.idUser;
            // Procurar o operador pelo idUser
            const nicknameOperator = await User.findOne({ _id: idUser });
            if (!nicknameOperator) {
                return res.status(404).json({ error: 'Operador não encontrado' });
            }

            // Procurar o usuário promovido pelo nickname
            const nicknameRelegation = await User.findOne({ nickname: promoted });

            // Conectar ao Habbo para verificar a existência do usuário
            const responseHabbo = await utils.connectHabbo(promoted.trim());
            if (responseHabbo === "error") {
                return res.status(404).json({ error: 'Este usuário não existe no Habbo Hotel' });
            }

            // Validar se o operador tem permissão para contratar o usuário promovido
            const validateSuperior = await utils.isSuperior(nicknameOperator, nicknameRelegation, "Contrato", patent, req);
            if (validateSuperior === false) {
                return res.status(422).json({ error: 'Ops! Você não tem permissão para contratar esse usuário. Reporte o caso para algum superior.' });
            }

            // Verificar se o usuário promovido já está registrado
            if (nicknameRelegation) {
                const response = await utils.RegisterContExist(nicknameRelegation.nickname, patent, " ");
                if (response.status === false) {
                    return res.status(400).json({ error: response.info });
                }
            } else {
                // Registrar novo usuário se não estiver registrado
                const registrered = await utils.register(promoted.trim(), patent);
                if (registrered.status === false) {
                    return res.status(422).json({ error: registrered.info });
                }
            }

            // Criar novo requisito de contrato
            const newRequirement = {
                promoted,
                newPatent: patent,
                newMotto: `${promoted} - Contratado por [${nicknameOperator.tag}] em ${utils.getCurrentDate()}`,
                reason,
                patentOperador: nicknameOperator.patent,
                operator: nicknameOperator.nickname,
                typeRequirement: "Contrato",
                status: "Pendente"
            };

            // Salvar o requisito no banco de dados
            const resRequeriment = await Requirements.create(newRequirement);
            return !resRequeriment
                ? res.status(422).json({ error: "Houve um erro, tente novamente mais tarde" })
                : res.status(201).json({ msg: "Contrato efetuado com sucesso." });

        } catch (error) {
            console.error("Erro ao registrar", error);
            res.status(500).json({ msg: "Erro ao efetuar cadastro" });
        }
    };

    async createSales(req, res) {
        try {
            const { promoted, patent, reason, price } = req.body;
            const idUser = req.idUser;
            const nicknameOperator = await User.findOne({ _id: idUser });
            const nicknameRelegation = await User.findOne({ nickname: promoted });
            const info = await InfoSystem.findOne();

            if (!info || !info.patents || !info.paidPositions) {
                return res.status(500).json({ msg: 'Informações do sistema não encontradas.' });
            }
            if (nicknameRelegation) {
                utils.RegisterContExist(promoted, patent, false, true)

            } else {
                await utils.register(promoted, patent);
            }

            const validete = await utils.isDiretor(nicknameOperator.patent);

            if (nicknameOperator.userType === "Admin" || validete === true) {
                const newRequirement = {
                    promoted,
                    newPatent: patent,
                    newMotto: `${promoted} - Integrado por [${nicknameOperator.tag}] em ${utils.getCurrentDate()}`,
                    reason,
                    patentOperador: nicknameOperator.patent,
                    operator: nicknameOperator.nickname,
                    price,
                    typeRequirement: "Venda",
                    status: "Pendente"
                };


                const newSale = await Requirements.create(newRequirement);
                return !newSale
                    ? res.status(422).json({ error: "Houve um erro, tente novamente mais tarde" })
                    : res.status(201).json({ msg: "Venda efetuada com sucesso." });

            }
            return res.status(422).json({ error: 'Ops! Você não tem permissão para vender cargo ' });


        } catch (error) {
            console.error("Erro ao registrar", error);
            res.status(500).json({ msg: "Erro ao efetuar cadastro" });
        }
    };

    async getAllRequirementsPromoteds(req, res) {
        try {
            const statusRequirement = req.query.statusRequirement;
            const typeRequirement = req.query.typeRequirement
            const requirements = await Requirements.find({ typeRequirement: typeRequirement });

            if (statusRequirement) {
                const filteredRequirements = requirements.filter(objeto => {
                    return objeto.status === statusRequirement;
                });
                return res.json(filteredRequirements);
            }

            return res.json(requirements);

        } catch (error) {
            console.error('Erro ao obter os requisitos:', error);
            res.status(500).json({ msg: 'Erro ao obter os requisitos' });
        }
    };

    async getAllRequirementsTeams(req, res) {
        try {
            const teamRequirement = req.query.teamRequirement;
            const page = parseInt(req.query.page) || 1; // Página atual (padrão: 1)
            const limit = parseInt(req.query.limit) || 10; // Limite de itens por página (padrão: 10)
            const skip = (page - 1) * limit; // Quantidade de itens a pular

            // Encontrar e paginar os requisitos
            const requirements = await Requirements.find({ team: teamRequirement })
                .sort({ _id: -1 }) // Ordenar em ordem decrescente pelo campo _id
                .skip(skip)
                .limit(limit);

            // Obter o total de requisitos para a equipe
            const totalRequirements = await Requirements.countDocuments({ team: teamRequirement });

            // Calcular o total de páginas
            const totalPages = Math.ceil(totalRequirements / limit);

            // Enviar a resposta paginada
            return res.json({
                requirements,
                currentPage: page,
                totalPages: totalPages,
                totalRequirements: totalRequirements
            });

        } catch (error) {
            console.error('Erro ao obter os requisitos:', error);
            res.status(500).json({ msg: 'Erro ao obter os requisitos' });
        }
    };

    async searchRequeriments(req, res) {
        try {
            const nameRequeriment = req.query.promoted;
            const Requirement = await Requirements.find({ promoted: nameRequeriment });
            res.json(Requirement)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
};
