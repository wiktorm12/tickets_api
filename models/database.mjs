import knex from 'knex';
import log from 'log-to-file';

let cachedConnection, timeoutConnection, intervalConnection;

export default (...args) => {
	if(!cachedConnection){
		cachedConnection = knex({
			client: 'mysql',
			connection: {
				host : process.env.DB_HOST,
				port : process.env.DB_PORT,
				user : process.env.DB_USER,
				password : process.env.DB_PASSWORD,
				database : process.env.DB_NAME
			}
		});
		cachedConnection.on('query', (query) => {
			const {sql, bindings} = query
			if( sql == "SELECT 1;")
				return;
			const queryString = sql.split('?').map((part, i, arg) => {
				return part + ( (i < arg.length-1)? `'${bindings[i]}'` : '' )
			}).join('')
			log(`${queryString}`, `${process.folders.logs}/sql.log`);
		})
		cachedConnection.on('query-error', (error) => {
			log(`${error}`, `${process.folders.logs}/sql-errors.log`);
		})
		
		if(intervalConnection !== null)
			clearInterval(intervalConnection);

		intervalConnection = setInterval(() => {
			if(cachedConnection !== null)
				cachedConnection.raw('SELECT 1;').catch(() => {
					log('Database connection is dead', `${process.folders.logs}/sql.log`);
					cachedConnection.destroy();
					cachedConnection = null;
				})
		}, 1000 * 60)

		if(timeoutConnection !== null)
			clearTimeout(timeoutConnection);

		timeoutConnection = setTimeout(() => {
			cachedConnection.destroy();
			cachedConnection = null;
			clearInterval(intervalConnection);
			intervalConnection = null;
			console.log('MYSQL connection closed')
		}, 1000 * 60 * 60)
	}
	return cachedConnection(...args);
};