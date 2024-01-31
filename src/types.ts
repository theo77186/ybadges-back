export interface Badge {
    id: Number;
    fill: String;
    nom: String;
    categorie: String;
		description: String;
		owner_id:Number;
}

export interface Login {
	id: Number;
	classe: String;
	fill: String;
	filliere: String;
	mail: String;
	mdp: String;
	nom: String;
	prenom: String;
}

export interface Owner {
	id: Number;
	nom: String;
}

export interface OwnerRelation {
	badge_id: Number;
	owner_id:Number;
}

export interface Request {
	id: Number;
	com: String;
	idUser: Number;
	obj: String;
	preuve:Boolean;
}
