const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;
        const [count] = await connection('incidents').count('* as qtd');

        const incidents = await connection('incidents as i')
            .join('ongs as o', 'o.id', '=', 'i.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .orderBy('i.id')
            .select([
                'i.*',
                'o.name',
                'o.email',
                'o.whatsapp',
                'o.city',
                'o.uf'
            ]);
        
        response.header('X-Total-Count', count['qtd'])
        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents')
            .returning('id')
            .insert({
                title, description, value, ong_id
            });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({
                error: 'Sem permissão para este procedimento.'
            });
        }

        await connection('incidents')
            .where('id', id)
            .delete();

        return response.status(204).send();
    }
};